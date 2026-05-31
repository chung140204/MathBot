import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import { authLimiter, enforceRateLimit, getClientIp } from '@/shared/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(authLimiter, `register:${getClientIp(req)}`);
    if (limited) return limited;

    const body = await req.json();
    const { name, email, password } = body;

    // 1. Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ thông tin.', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 8 ký tự.', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Password complexity: at least 1 uppercase + 1 number
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 1 chữ in hoa và 1 chữ số.', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL is missing');
    }

    const sql = neon(dbUrl);

    // 2. Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Email này đã được sử dụng.', code: 'AUTH_EMAIL_TAKEN' },
        { status: 409 }
      );
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create user
    const id = crypto.randomUUID().replace(/-/g, '');
    const now = new Date();

    const result = await sql`
      INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt")
      VALUES (${id}, ${email}, ${hashedPassword}, ${name}, 'STUDENT', ${now}, ${now})
      RETURNING id, name, email, "createdAt"
    `;

    return NextResponse.json(
      { message: 'Tạo tài khoản thành công!', user: result[0] },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trong quá trình đăng ký.', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
