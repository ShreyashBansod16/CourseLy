import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
      
        try {      
          const { data, error } = await supabase
            .from("users")
            .select("id, username, email, password, isregistered, isadmin, created_at")
            .eq("email", credentials.email)
            .single();
      
          if (error) {
            throw new Error("Database error");
          }
      
          if (!data) {
            throw new Error("User not found");
          }
      
          const isValid = await bcrypt.compare(credentials.password, data.password);
      
          if (!isValid) {
            throw new Error("Invalid password");
          }
      
          console.log("✅ Password is correct");
      
          return {
            id: data.id,
            name: data.username,
            email: data.email,
            isAdmin: data.isadmin,
            isRegistered: true,
            created_at: data.created_at,
          };
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
      
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/user/login",
    error: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },
  secret: process.env.NEXTAUTH_SECRET,
};
