import { PrismaClient } from '@prisma/client';

declare global {
  // Allow Prisma singleton reuse in local development hot reloads.
  // eslint-disable-next-line no-var
  var __prismaClient__: PrismaClient | undefined;
}

const prismaClient =
  globalThis.__prismaClient__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prismaClient__ = prismaClient;
}

export { prismaClient };
