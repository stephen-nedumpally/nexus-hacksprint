import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { AdapterUser } from "next-auth/adapters";
import { Session } from "next-auth";
import { Prisma } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    scope?: string;
    user: {
      id: string;
      profile?: any;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    profile?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
    scope?: string;
  }
}

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
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.scope = account.scope;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.scope = token.scope;
      
      if (user) {
        session.user.id = user.id;
        session.user.verified = user.verified ?? false;
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
