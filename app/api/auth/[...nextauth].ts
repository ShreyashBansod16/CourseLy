import NextAuth, { NextAuthOptions } from "next-auth"

export const authOptions:NextAuthOptions = {
  providers: [
    
  ],
}

export default NextAuth(authOptions)