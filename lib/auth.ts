import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 [NextAuth] authorize() called');
        console.log('🔐 [NextAuth] email:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ [NextAuth] Missing credentials');
          throw new Error('Vui lòng nhập email và mật khẩu.');
        }

        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
          console.log('❌ [NextAuth] DATABASE_URL missing');
          throw new Error('DATABASE_URL is missing');
        }

        try {
          const sql = neon(dbUrl);

          // Tìm user bằng SQL thuần (bypass Prisma adapter issue)
          const rows = await sql`
            SELECT id, email, name, password, role
            FROM users
            WHERE email = ${credentials.email}
            LIMIT 1
          `;

          console.log('🔐 [NextAuth] Query result rows:', rows.length);

          if (rows.length === 0) {
            console.log('❌ [NextAuth] User not found');
            throw new Error('Email không tồn tại.');
          }

          const user = rows[0];
          console.log('✅ [NextAuth] User found:', user.email, user.id);

          if (!user.password) {
            console.log('❌ [NextAuth] No password stored');
            throw new Error('Tài khoản chưa có mật khẩu.');
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          console.log('🔐 [NextAuth] Password valid:', isValid);

          if (!isValid) {
            throw new Error('Mật khẩu không chính xác.');
          }

          const result = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
          console.log('✅ [NextAuth] Returning user:', result);
          return result;
        } catch (err) {
          console.error('❌ [NextAuth] Error in authorize:', err);
          throw err;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
