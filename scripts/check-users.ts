import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  neonConfig.webSocketConstructor = ws;
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ Lỗi: DATABASE_URL không tồn tại trong file .env');
    return;
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('🔍 Đang kiểm tra danh sách người dùng trong CSDL...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    if (users.length === 0) {
      console.log('ℹ️ CSDL hiện chưa có người dùng nào.');
    } else {
      console.table(users);
    }
  } catch (error) {
    console.error('❌ Lỗi khi truy vấn CSDL:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
