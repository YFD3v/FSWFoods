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
            email: credentials.email as string,
            password: credentials.password as string,
          });
          return user;
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error("Erro desconhecido ao autenticar");
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  //Caso de bug na session e ela se destruir sozinha, isso resolve:
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
