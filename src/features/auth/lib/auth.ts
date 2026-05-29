import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/shared/lib/db';

if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV !== 'production') {
  console.warn('NEXTAUTH_SECRET is not defined in environment variables.');
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Vui lòng nhập email và mật khẩu.');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, email: true, name: true, password: true, role: true, isLocked: true },
        });

        if (!user) {
          throw new Error('Email không tồn tại.');
        }

        if (!user.password) {
          throw new Error('Tài khoản chưa có mật khẩu.');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Mật khẩu không chính xác.');
        }

        if (user.isLocked) {
          throw new Error('Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
