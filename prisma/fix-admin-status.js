const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const r = await p.user.updateMany({
    where: { role: 'ADMIN' },
    data: { customerStatus: 'APPROVED', status: true }
  });
  console.log('Admin users updated:', r.count);
}

main().catch(console.error).finally(() => p.$disconnect());
