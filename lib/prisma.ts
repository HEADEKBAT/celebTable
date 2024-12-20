// lib/prisma.ts
import { PrismaClient as PrismaClientCelebrities } from "@prisma/client"; // Клиент для celebrities.db
import { PrismaClient as PrismaClientAuth } from "../prisma/generated/auth"; // Клиент для auth.db

declare global {
  // Чтобы избежать ошибки повторного объявления PrismaClient при перезапуске сервера в dev-режиме
  // eslint-disable-next-line no-var
  var prismaCelebrities: PrismaClientCelebrities | undefined;
  // eslint-disable-next-line no-var
  var prismaAuth: PrismaClientAuth | undefined;
}

// Инициализация клиента для базы данных celebrities
const prismaCelebrities =
  global.prismaCelebrities || new PrismaClientCelebrities();

// Инициализация клиента для базы данных auth
const prismaAuth = global.prismaAuth || new PrismaClientAuth();

if (process.env.NODE_ENV !== "production") {
  global.prismaCelebrities = prismaCelebrities;
  global.prismaAuth = prismaAuth;
}

// Экспортируем оба клиента
export { prismaCelebrities, prismaAuth };
