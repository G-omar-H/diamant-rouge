// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const prisma = new PrismaClient();

// Define the JWT type
type JWT = {
    id: string;
    role: string;
    email: string;
};

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },

    jwt: {
        // Provide custom encode/decode to skip JWE
        async encode({ token, secret }) {
            if (!token) {
                throw new Error('Le token est indéfini');
            }
            // Ensure secret is a string
            const secretString = typeof secret === 'string' ? secret : secret.toString();
            // Create a sign-only JWT (HS256)
            return await new SignJWT({
                id: token.id,
                role: token.role,
                email: token.email,
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime('7d')
                .sign(new TextEncoder().encode(secretString));
        },
        async decode({ token, secret }) {
            // Ensure secret is a string
            const secretString = typeof secret === 'string' ? secret : secret.toString();
            // Verify & decode the sign-only JWT
            if (!token) return null;
            try {
                const { payload } = await jwtVerify(
                    token,
                    new TextEncoder().encode(secretString)
                );
                // Return payload as NextAuth's token
                return {
                    id: payload.id as string,
                    role: payload.role as string,
                    email: payload.email as string,
                } as JWT;
            } catch (err) {
                console.error('Custom decode error:', err);
                return null;
            }
        },
    },

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                console.log('authorize => user login attempt =>', credentials);

                if (!credentials?.email || !credentials.password) {
                    throw new Error('Email ou mot de passe manquant');
                }
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (!user) throw new Error('Aucun utilisateur trouvé');

                const isValid = await compare(credentials.password, user.password);
                if (!isValid) throw new Error('Identifiants invalides');

                console.log('authorize => user =>', user);
                return {
                    id: user.id.toString(), // Convert id to string
                    email: user.email,
                    role: user.role,
                    name: user.name,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            console.log('JWT callback => token before =>', token);
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.email = user.email;
            }
            console.log('JWT callback => token after =>', token);
            return token;
        },

        async session({ session, token }) {
            console.log('Session callback => token =>', token);

            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.email = token.email as string;
            }
            console.log('Session callback => final session =>', session);
            return session;
        },
    },
};

export default NextAuth(authOptions);