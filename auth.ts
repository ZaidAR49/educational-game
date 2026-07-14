import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { users, accounts, sessions, verificationToken } from "@/lib/db/schema"

const authResult = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: { params: { prompt: "select_account" } }
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationToken,
  }),
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/login',
    error: '/auth-error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user?.email) return true;
      try {
        const dbUser = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, user.email as string),
          columns: { isLocked: true }
        });
        if (dbUser?.isLocked) {
          return false;
        }
      } catch (error) {
        // DB timeout during sign-in — fail open to prevent the OAuth flow from
        // hanging. The isLocked check in requireAuth() will catch it on next page load.
        console.error("[auth] signIn DB check failed, allowing sign-in:", error);
      }
      return true;
    },
    async jwt({ token, user, profile, trigger, session }) {
      if (user) {
        // First sign-in: user object is populated from the OAuth profile + adapter
        token.id = user.id
        token.image = user.image || (profile?.picture as string)
        token.name = user.name
        token.role = user.role
        token.isLocked = user.isLocked
      } else if (!token.id && token.email) {
        // Fallback for old tokens that don't have id — use sub first, then DB
        token.id = token.sub; // sub is always set by Auth.js from the OAuth provider
        try {
          const dbUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, token.email as string),
            columns: { id: true, role: true, isLocked: true }
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.isLocked = dbUser.isLocked;
          }
        } catch (error) {
          console.error("[auth] jwt DB fallback failed, using sub:", error);
        }
      }
      if (trigger === "update" && session) {
        // Handle both { name: "..." } and { user: { name: "..." } }
        const newName = session.name || session.user?.name;
        if (newName) {
          token.name = newName;
        }
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.image = token.image as string
        session.user.role = token.role as string
        session.user.isLocked = token.isLocked as boolean
      }
      return session
    },
  },
}) 

export const { handlers, signIn, signOut, auth } = authResult;
export const update = (authResult as any).unstable_update || (authResult as any).update;
