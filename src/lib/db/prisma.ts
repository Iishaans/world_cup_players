import { PrismaClient } from "@prisma/client";

declare global {
  var __wc5sPrisma: PrismaClient | undefined;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export const prisma: PrismaClient =
  globalThis.__wc5sPrisma ??
  (globalThis.__wc5sPrisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  }));
