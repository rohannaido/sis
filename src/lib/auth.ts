import db from "@/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWTPayload, SignJWT, importJWK } from "jose";
import bcrypt from "bcrypt";
import prisma from "@/db";
import { getServerSession, NextAuthOptions } from "next-auth";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export interface UserSession extends Session {
  user: {
    id: string;
    jwtToken: string;
    role: string;
    email: string;
    name: string;
    organizationId: number;
    isAdmin: boolean;
  };
}

interface token extends JWT {
  uid: string;
  jwtToken: string;
  organizationId: number;
  isAdmin: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  organizationId: number;
  isAdmin: boolean;
}

const generateJWT = async (payload: JWTPayload) => {
  const secret = process.env.JWT_SECRET || "secret";

  const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(jwk);

  return jwt;
};

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "email", type: "text", placeholder: "" },
        password: { label: "password", type: "password", placeholder: "" },
      },
      async authorize(credentials: any) {
        try {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);

          const userDb = await prisma.user.findFirst({
            where: {
              email: credentials.username,
            },
            select: {
              password: true,
              id: true,
              name: true,
              organizationId: true,
              isAdmin: true,
            },
          });

          // TODO: Add hashed password
          if (
            userDb &&
            userDb.password
            // &&
            // (await bcrypt.compare(credentials.password, userDb.password))
          ) {
            const jwt = await generateJWT({
              id: userDb.id,
            });

            await db.user.update({
              where: {
                id: userDb.id,
              },
              data: {
                token: jwt,
              },
            });

            return {
              organizationId: userDb.organizationId,
              id: userDb.id,
              name: userDb.name,
              email: credentials.username,
              token: jwt,
              isAdmin: userDb.isAdmin,
            };
          }

          // Return null if user data could not be retrieved
          return null;
        } catch (e) {
          console.error(e);
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secret",
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      if (account?.provider === "google" && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            name: true,
            email: true,
            organizationId: true,
            isAdmin: true,
            password: true,
          },
        });

        let newUser;
        if (existingUser) {
          if (existingUser.password) {
            return false;
          }
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: user.name,
            },
          });
        } else {
          const organization = await prisma.organization.create({});
          newUser = await prisma.user.create({
            data: {
              organizationId: organization.id,
              name: user.name,
              email: user.email,
              isAdmin: true,
            },
          });
        }

        user.id = existingUser?.id ?? "";
        user.name = existingUser?.name ?? "";
        user.email = existingUser?.email ?? "";
        if (existingUser) {
          (user as any).organizationId = existingUser.organizationId;
          (user as any).isAdmin = existingUser.isAdmin;
        } else if (newUser) {
          (user as any).organizationId = newUser.organizationId;
          (user as any).isAdmin = newUser.isAdmin;
        }
      }

      return true;
    },
    session: async ({ session, token }): Promise<UserSession> => {
      const newSession: UserSession = session as UserSession;
      if (newSession.user && token.uid) {
        newSession.user.organizationId = token.organizationId as number;
        newSession.user.id = token.uid as string;
        newSession.user.jwtToken = token.jwtToken as string;
        newSession.user.role = process.env.ADMINS?.split(",").includes(
          session.user?.email ?? ""
        )
          ? "admin"
          : "user";
        newSession.user.isAdmin = token.isAdmin as boolean;
      }
      return newSession!;
    },
    jwt: async ({ token, user }): Promise<JWT> => {
      const newToken: token = token as token;

      if (user) {
        newToken.uid = user.id;
        newToken.organizationId = (user as User).organizationId;
        newToken.jwtToken = (user as User).token;
        newToken.isAdmin = (user as User).isAdmin;
      }
      return newToken;
    },
  },
  pages: {
    signIn: "/signin",
  },
} satisfies NextAuthOptions;

export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}
