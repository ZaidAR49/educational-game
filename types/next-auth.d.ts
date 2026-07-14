/**
 * Fix #16: Extend NextAuth types to include custom fields (role, isLocked).
 * This eliminates all @ts-ignore comments in auth.ts and provides proper
 * type safety throughout the codebase when accessing session.user.role etc.
 */
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isLocked: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    isLocked?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    isLocked?: boolean;
  }
}
