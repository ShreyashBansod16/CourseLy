import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
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
          const { data, error } = await supabaseAdmin
            .from("users")
            .select(
              "id, username, email, password, isregistered, isadmin, created_at"
            )
            .eq("email", credentials.email)
            .single();

          if (error) {
            throw new Error("Database error");
          }

          if (!data) {
            throw new Error("User not found");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            data.password
          );

          if (!isValid) {
            throw new Error("Invalid password");
          }

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
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Check if the user already exists
        const { data: existingUser, error } = await supabaseAdmin
          .from("users")
          .select("id, email")
          .eq("email", user.email!)
          .single();

        if (!existingUser) {
          // If user does not exist, create a new entry
          const randomPassword = Math.random().toString(36).substring(7);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
          const { data, error } = await supabaseAdmin
            .from("users")
            .insert([{ email: user.email, username: user.name, isadmin: false, password: hashedPassword }])
            .select()
            .single();
          // if(data) {
          //   console.log("User created:", data);
          // }

          if (error) {
            console.error("Error creating user:", error);
            return false;
          }

          user.id = data.id;
        } else {
          user.id = existingUser.id;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.isRegistered = user.isRegistered;
        token.created_at = user.created_at;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
        // @ts-ignore
        session.user.isRegistered = token.isRegistered;
        // @ts-ignore
        session.user.created_at = token.created_at;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      try {
        // Respect relative callbackUrl like "/courses/allcourses" or "/"
        if (url.startsWith("/")) return `${baseUrl}${url}`;

        // Allow same-origin absolute URLs
        const to = new URL(url);
        const base = new URL(baseUrl);
        if (to.origin === base.origin) return url;

        // External URLs fallback to home
        return baseUrl;
      } catch {
        return baseUrl;
      }
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