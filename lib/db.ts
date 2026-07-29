
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// const globalForPrisma = globalThis as unknown as {
//   prismaDB: PrismaClient | undefined;
// };

// const databaseUrl = process.env.DATABASE_URL;

// if (!databaseUrl) {
//   throw new Error("DATABASE_URL is not set");
// }

// export const db =
//   globalForPrisma.prismaDB ||
//   new PrismaClient({
//     adapter: new PrismaMariaDb(databaseUrl),
//     log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
//   });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prismaDB = db;

// export default db;

import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = import.meta.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient ({ adapter });

export default prisma;