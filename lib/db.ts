import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    const errorMsg = 'DATABASE_URL is not set in environment variables';
    console.error(`[Prisma DB] ${errorMsg}`);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMsg);
    }
  }

  if (process.env.NODE_ENV !== 'production' && connectionString) {
    console.log(`[Prisma DB] Initializing with connection string (length: ${connectionString.length})`);
  }
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool as any);

  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
