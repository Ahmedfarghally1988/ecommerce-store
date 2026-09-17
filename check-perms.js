const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const count = await prisma.permission.count();
  console.log("Permission count:", count);
}

check().finally(() => prisma.$disconnect());
