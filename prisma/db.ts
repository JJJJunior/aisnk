import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here
  console.log("db已连接...");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
    // console.log("db已断开...");
  });
