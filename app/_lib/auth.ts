import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import { db } from "./prisma";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticate } from "../signin/_actions/handleSignIn";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  pages: {
    signIn: "/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password)
          return null;
        try {
          const user = await authenticate({
            email: credentials?.email as string,
            password: credentials?.password as string,
          });

          return user;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user = { ...session.user, id: user.id };
      return session;
    },

    async signIn(params) {
      if (params?.account?.type === "credentials") {
        return "/dashboard";
      }
      return "/";
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
