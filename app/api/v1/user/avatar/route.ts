import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WebP, GIF allowed.' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const rawExt = file.name.split('.').pop()?.toLowerCase() || '';
    const ext = allowedExts.includes(rawExt) ? rawExt : 'jpg';
    const fileName = `avatar-${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}.${ext}`;
    const filePath = join(uploadDir, fileName);

    if (!filePath.startsWith(uploadDir)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/avatars/${fileName}` });
  } catch (error: unknown) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
