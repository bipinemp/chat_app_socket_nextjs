import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          username: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const User = await db.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!User) {
          return null;
        }

        if (User.password) {
          const DoesPasswordMatches = await compare(
            credentials.password,
            User.password
          );
          if (!DoesPasswordMatches) {
            return null;
          }
        } else {
          return null;
        }

        return {
          id: User.id.toString(),
          email: User.email,
          username: User.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          image: session.user.image,
          email: session.user.email,
          id: token.id,
          username: token.username,
        },
      };
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "sfjkldjafkdljflkd439043890",
};
