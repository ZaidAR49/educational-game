import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"

export const { handlers, signIn, signOut, auth, update } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user, profile, trigger, session }) {
      if (user) {
        token.id = user.id
        token.image = user.image || (profile?.picture as string)
        token.name = user.name // Always use the name from the database
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
      }
      return session
    },
  },
})
