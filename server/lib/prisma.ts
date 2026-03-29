import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL as string;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
