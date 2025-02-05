// import { DefaultSession } from "next-auth";
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: String;
//     } & DefaultSession["user"];
//   }
// }


import NextAuth, { DefaultSession, DefaultUser, JWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      isAdmin: boolean;
      isRegistered: boolean;
      created_at: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    isAdmin: boolean;
    isRegistered: boolean;
    created_at: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAdmin: boolean;
    isRegistered: boolean;
    created_at: string;
  }
}
