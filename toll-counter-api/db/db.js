import { PrismaClient } from '@prisma/client';

if (!global.prisma) {
  const clientParams =
    process.env.NODE_ENV === 'development'
      ? {
          log: [{ level: 'query', emit: 'event' }],
        }
      : {};
  global.prisma = new PrismaClient(clientParams);
}

if (process.env.NODE_ENV === 'development') {
  global.prisma.$on('query', (e) => {
    console.log(e);
  });
}

export const prisma = global.prisma;
