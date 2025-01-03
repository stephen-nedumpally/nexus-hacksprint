import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { AdapterUser } from "next-auth/adapters";
import { Session } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: AdapterUser }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          verified: user.verified ?? false,
        },
      };
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
