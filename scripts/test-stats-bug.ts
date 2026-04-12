import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { startOfToday } from 'date-fns';
import dotenv from 'dotenv';

dotenv.config();

neonConfig.webSocketConstructor = ws;

async function test() {
  const connectionString = process.env.DATABASE_URL;
  console.log('DATABASE_URL length:', connectionString?.length || 0);
  console.log('DATABASE_URL starts with:', connectionString?.substring(0, 10));
  const pool = new Pool({ connectionString });
  // If the above doesn't work, maybe it's the specific pooler URL?
  // Let's try to log the pool object
  console.log('Pool config:', (pool as any).options?.connectionString ? 'has string' : 'no string');
  const adapter = new PrismaNeon(pool as any);
  const prisma = new PrismaClient({ adapter });

  try {
    const today = startOfToday();
    console.log('Today:', today);

    console.log('Testing totalUsers...');
    const totalUsers = await prisma.user.count();
    console.log('totalUsers:', totalUsers);

    console.log('Testing totalQuestions...');
    const totalQuestions = await prisma.question.count({ where: { isActive: true } });
    console.log('totalQuestions:', totalQuestions);

    console.log('Testing examsToday...');
    const examsToday = await prisma.examAttempt.count({ where: { submittedAt: { gte: today } } });
    console.log('examsToday:', examsToday);

    console.log('Testing aiChatsToday...');
    const aiChatsToday = await prisma.chatMessage.count({ where: { createdAt: { gte: today }, role: 'assistant' } });
    console.log('aiChatsToday:', aiChatsToday);

    console.log('Success!');
  } catch (error) {
    console.error('Test Failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

test();
