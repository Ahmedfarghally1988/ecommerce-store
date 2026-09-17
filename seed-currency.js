const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existingBase = await prisma.currency.findFirst({ where: { isBase: true } });
  if (!existingBase) {
    console.log('No base currency found. Creating EGP as base currency...');
    await prisma.currency.upsert({
      where: { code: 'EGP' },
      update: {
        isBase: true,
        exchangeRate: 1.0,
      },
      create: {
        code: 'EGP',
        nameEn: 'Egyptian Pound',
        nameAr: 'الجنيه المصري',
        symbol: 'EGP',
        exchangeRate: 1.0,
        isBase: true,
        isActive: true,
      }
    });
    console.log('EGP created successfully as base currency.');
  } else {
    console.log(`Base currency already exists: ${existingBase.code}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
