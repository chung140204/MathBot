import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Required for Neon WebSocket connection in Node.js/standard environment
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    const errorMsg = 'DATABASE_URL is not set in environment variables';
    console.error(`[Prisma DB] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  // Remove potential quotes and ensure it's a string
  const cleanConnectionString = connectionString.replace(/^["']|["']$/g, '');

  const pool = new Pool({ connectionString: cleanConnectionString });
  const adapter = new PrismaNeon(pool);

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

// Cache the client on globalThis in ALL environments. In production
// (serverless/long-lived) this prevents rebuilding the Neon Pool + WebSocket
// connection on every module re-eval, keeping that setup cost off the request
// (and thus off TTFT). The `??` above reuses it whenever the module is re-run.
globalThis.prismaGlobal = prisma;
