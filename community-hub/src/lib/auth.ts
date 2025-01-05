import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { AdapterUser } from "next-auth/adapters";
import { Session } from "next-auth";
import { Prisma } from "@prisma/client";

// Create a custom adapter that maps emailVerified to verified
const customPrismaAdapter = {
  ...PrismaAdapter(prisma),
  createUser: async (data: any) => {
    const { emailVerified, ...rest } = data;
    return prisma.user.create({
      data: {
        ...rest,
        verified: emailVerified !== null,
      },
    });
  },
  getUser: async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return {
      ...user,
      emailVerified: user.verified ? new Date() : null,
    };
  },
  getUserByEmail: async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return {
      ...user,
      emailVerified: user.verified ? new Date() : null,
    };
  },
};

export const authOptions: NextAuthOptions = {
  adapter: customPrismaAdapter,
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
