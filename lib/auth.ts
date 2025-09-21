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
          const emailLower = credentials.email.toLowerCase();
          const { data, error } = await supabaseAdmin
            .from("users")
            .select(
              "id, username, email, password, isregistered, isadmin, created_at"
            )
            .ilike("email", emailLower)
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
        const emailLower = (user.email || "").toLowerCase();
        // Ensure user exists and hydrate admin-related fields
        const { data: existing } = await supabaseAdmin
          .from("users")
          .select("id, email, username, isadmin, created_at")
          .ilike("email", emailLower)
          .maybeSingle();

        if (!existing) {
          const randomPassword = Math.random().toString(36).slice(2);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
          const { data: created, error: createErr } = await supabaseAdmin
            .from("users")
            .insert([{ email: emailLower, username: user.name, isadmin: false, password: hashedPassword }])
            .select("id, email, username, isadmin, created_at")
            .single();
          if (createErr || !created) return false;
          user.id = created.id as any;
          // @ts-ignore
          user.isAdmin = !!created.isadmin;
          // @ts-ignore
          user.isRegistered = true;
          // @ts-ignore
          user.created_at = created.created_at;
          user.name = created.username || user.name;
        } else {
          user.id = (existing as any).id;
          // @ts-ignore
          user.isAdmin = !!existing.isadmin;
          // @ts-ignore
          user.isRegistered = true;
          // @ts-ignore
          user.created_at = existing.created_at;
          user.name = existing.username || user.name;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.isAdmin = user.isAdmin ?? token.isAdmin ?? false;
        // @ts-ignore
        token.isRegistered = user.isRegistered ?? token.isRegistered ?? true;
        // @ts-ignore
        token.created_at = user.created_at ?? token.created_at;
        token.email = (user as any).email ?? token.email;
      }
      // Backfill admin flag if missing on subsequent requests
      if (!user && token?.email && typeof (token as any).isAdmin === "undefined") {
        try {
          const { data } = await supabaseAdmin
            .from("users")
            .select("isadmin, created_at")
            .ilike("email", (token.email as string).toLowerCase())
            .maybeSingle();
          if (data) {
            // @ts-ignore
            token.isAdmin = !!data.isadmin;
            // @ts-ignore
            token.created_at = token.created_at ?? data.created_at;
          }
        } catch {}
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
        session.user.isAdmin = (token as any).isAdmin ?? false;
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