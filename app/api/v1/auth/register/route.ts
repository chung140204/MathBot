import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    console.log('Registration Fields Recieved:', { name, email, password });

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

    // Kết nối trực tiếp bằng Neon HTTP (không qua Prisma)
    const dbUrl = process.env.DATABASE_URL;
    console.log('🔍 [Register] URL first 50 chars:', dbUrl?.substring(0, 50));
    
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

    // 4. Create user (sử dụng cuid-like ID)
    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    const now = new Date();

    const result = await sql`
      INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt")
      VALUES (${id}, ${email}, ${hashedPassword}, ${name}, 'STUDENT', ${now}, ${now})
      RETURNING id, name, email, "createdAt"
    `;

    console.log('✅ User created:', result[0]);

    return NextResponse.json(
      { message: 'Tạo tài khoản thành công!', user: result[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trong quá trình đăng ký.', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
