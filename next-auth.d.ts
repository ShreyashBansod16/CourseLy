import NextAuth, { DefaultSession, DefaultUser, JWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      isAdmin?: boolean;
      created_at: string;
      isRegistered?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    isAdmin?: boolean;
    created_at?: string;
    isRegistered?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAdmin?: boolean;
    created_at?: string;
  }
}
