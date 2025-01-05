import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/chat.spaces.readonly",
            "https://www.googleapis.com/auth/chat.messages.readonly"
          ].join(" ")
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) return false;
      
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { profile: true }
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "",
              image: user.image || "",
              profile: {
                create: {
                  bio: "Hello! I'm new here.",
                  avatar: user.image || "",
                  courses: {
                    create: [
                      {
                        name: "Introduction to Programming",
                        description: "Learn the basics of programming",
                        progress: 0
                      },
                      {
                        name: "Web Development Fundamentals",
                        description: "Master HTML, CSS, and JavaScript",
                        progress: 0
                      }
                    ]
                  }
                }
              }
            }
          });
        } else if (!existingUser.profile) {
          await prisma.profile.create({
            data: {
              userId: existingUser.id,
              bio: "Hello! I'm new here.",
              avatar: user.image || "",
              courses: {
                create: [
                  {
                    name: "Introduction to Programming",
                    description: "Learn the basics of programming",
                    progress: 0
                  },
                  {
                    name: "Web Development Fundamentals",
                    description: "Master HTML, CSS, and JavaScript",
                    progress: 0
                  }
                ]
              }
            }
          });
        }
        return true;
      } catch (error) {
        console.error("Error in sign in callback:", error);
        return false;
      }
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          scope: account.scope,
          userId: user.id
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.userId as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.scope = token.scope as string;

        try {
          const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            include: {
              profile: {
                include: {
                  courses: true
                }
              }
            }
          });

          if (user?.profile) {
            session.user.profile = user.profile;
          }
        } catch (error) {
          console.error("Error in session callback:", error);
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };