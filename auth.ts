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
    error: '/blocked',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user?.email) return true;
      const dbUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, user.email as string),
        columns: { isLocked: true }
      });
      if (dbUser?.isLocked) {
        return false;
      }
      return true;
    },
    async jwt({ token, user, profile, trigger, session }) {
      if (user) {
        token.id = user.id
        token.image = user.image || (profile?.picture as string)
        token.name = user.name // Always use the name from the database
        // @ts-ignore
        token.role = user.role
        // @ts-ignore
        token.isLocked = user.isLocked
      } else if (!token.id && token.email) {
        // Fallback for old tokens that don't have id
        const dbUser = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, token.email as string),
          columns: { id: true, role: true, isLocked: true }
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.isLocked = dbUser.isLocked;
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
        // @ts-ignore
        session.user.role = token.role as string
        // @ts-ignore
        session.user.isLocked = token.isLocked as boolean
      }
      return session
    },
  },
}) as any;

export const { handlers, signIn, signOut, auth } = authResult;
export const update = authResult.unstable_update || authResult.update;
