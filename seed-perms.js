const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const permissionsList = [
  'dashboard.view',
  'products.view', 'products.create', 'products.edit', 'products.delete',
  'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
  'brands.view', 'brands.create', 'brands.edit', 'brands.delete',
  'orders.view', 'orders.create', 'orders.edit', 'orders.delete',
  'customers.view', 'customers.create', 'customers.edit', 'customers.delete', 'customers.approve', 'customers.suspend',
  'admin_users.view', 'admin_users.create', 'admin_users.edit', 'admin_users.delete', 'admin_users.permissions',
  'coupons.view', 'coupons.create', 'coupons.edit', 'coupons.delete',
  'settings.view', 'settings.edit',
  'media.view'
];

async function seedPermissions() {
  console.log('Seeding permissions...');
  let count = 0;
  for (const action of permissionsList) {
    const existing = await prisma.permission.findUnique({ where: { action } });
    if (!existing) {
      await prisma.permission.create({ data: { action } });
      count++;
    }
  }
  console.log(`Successfully seeded ${count} permissions.`);
}

seedPermissions()
  .then(() => prisma.$disconnect())
  .catch(err => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });
