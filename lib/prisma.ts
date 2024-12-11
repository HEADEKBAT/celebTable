// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Чтобы избежать ошибки повторного объявления PrismaClient при перезапуске сервера в dev-режиме
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;