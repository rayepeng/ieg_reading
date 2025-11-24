import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const admin = await prisma.admin.findUnique({
                    where: { username: credentials.username }
                });

                if (!admin) {
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, admin.passwordHash);

                if (!isValid) {
                    return null;
                }

                return { id: admin.id.toString(), name: admin.username };
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.name = token.name;
            }
            return session;
        }
    }
};
