import { PrismaClient, Role, CouponType, OrderStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();



async function main() {
  console.log('Starting seeding...');

  // 1. Create Permissions
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
    'media.view',
    'sliders.view', 'sliders.create', 'sliders.edit', 'sliders.delete',
    'newsletter.view', 'newsletter.send', 'newsletter.delete'
  ];

  for (const action of permissionsList) {
    await prisma.permission.upsert({
      where: { action },
      update: {},
      create: { action },
    });
  }
  console.log('Created permissions.');

  // 2. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 2. Create Categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      nameEn: 'Electronics',
      nameAr: 'إلكترونيات',
      slug: 'electronics',
      descriptionEn: 'Gadgets, phones, laptops and more',
      descriptionAr: 'أدوات، هواتف، حواسيب محمولة والمزيد',
      sortOrder: 1,
    },
  });

  const phones = await prisma.category.upsert({
    where: { slug: 'phones' },
    update: {},
    create: {
      nameEn: 'Phones',
      nameAr: 'هواتف',
      slug: 'phones',
      parentId: electronics.id,
      sortOrder: 1,
    },
  });

  const fashion = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      nameEn: 'Laptops',
      nameAr: 'حواسيب محمولة',
      slug: 'laptops',
      descriptionEn: 'High performance laptops',
      descriptionAr: 'حواسيب محمولة عالية الأداء',
      sortOrder: 2,
    },
  });

  // 3. Create Brands
  const apple = await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: {
      nameEn: 'Apple',
      nameAr: 'أبل',
      slug: 'apple',
      descriptionEn: 'Think different.',
      descriptionAr: 'فكر باختلاف.',
    },
  });

  const samsung = await prisma.brand.upsert({
    where: { slug: 'samsung' },
    update: {},
    create: {
      nameEn: 'Samsung',
      nameAr: 'سامسونج',
      slug: 'samsung',
    },
  });

  // 4. Create Products
  const iphone15 = await prisma.product.upsert({
    where: { slug: 'iphone-15-pro' },
    update: {},
    create: {
      nameEn: 'iPhone 15 Pro',
      nameAr: 'أيفون 15 برو',
      slug: 'iphone-15-pro',
      sku: 'IP15P-128-BLK',
      price: 999.0,
      compareAtPrice: 1099.0,
      stock: 50,
      descriptionEn: 'The latest iPhone 15 Pro with titanium body.',
      descriptionAr: 'أحدث أيفون 15 برو بهيكل من التيتانيوم.',
      shortDescriptionEn: 'Titanium. So strong. So light. So Pro.',
      shortDescriptionAr: 'تيتانيوم. قوي جدا. خفيف جدا.',
      categoryId: phones.id,
      brandId: apple.id,
      isFeatured: true,
      images: {
        create: [
          { url: '/images/products/iphone15pro-1.jpg', alt: 'iPhone 15 Pro Front', sortOrder: 1 },
          { url: '/images/products/iphone15pro-2.jpg', alt: 'iPhone 15 Pro Back', sortOrder: 2 },
        ]
      },
      variants: {
        create: [
          {
            nameEn: 'MacBook Pro 16" Space Gray',
            nameAr: 'ماك بوك برو 16 رمادي فلكي',
            sku: 'IP15P-128-BLK-V',
            price: 999.0,
            stock: 20,
            attributes: { storage: '128GB', color: 'Black Titanium' }
          },
          { nameEn: '256GB Black', nameAr: '256 جيجابايت أسود', sku: 'IP15P-256-BLK-V', price: 1099.0, stock: 30, attributes: { storage: '256GB', color: 'Black Titanium' } },
        ]
      }
    },
  });

  const galaxyS24 = await prisma.product.upsert({
    where: { slug: 'galaxy-s24-ultra' },
    update: {},
    create: {
      nameEn: 'Samsung Galaxy S24 Ultra',
      nameAr: 'سامسونج جالاكسي إس 24 ألترا',
      slug: 'samsung-galaxy-s24-ultra',
      sku: 'GS24U-256-GRY',
      price: 1199.0,
      stock: 40,
      descriptionEn: 'The ultimate Android experience.',
      descriptionAr: 'تجربة أندرويد المطلقة.',
      shortDescriptionEn: 'AI powered smartphone',
      shortDescriptionAr: 'هاتف ذكي مدعوم بالذكاء الاصطناعي',
      categoryId: phones.id,
      brandId: samsung.id,
      isFeatured: true,
      images: {
        create: [
          { url: '/images/products/galaxys24-1.jpg', alt: 'Galaxy S24 Ultra', sortOrder: 1 },
        ]
      }
    },
  });

  // 5. Create Customer User
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'customer@example.com',
      password: customerPassword,
      role: Role.CUSTOMER,
      phone: '+1987654321',
      addresses: {
        create: [
          {
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1987654321',
            country: 'Egypt',
            city: 'Cairo',
            address: '123 Main St, Appt 4B',
            isDefault: true,
          }
        ]
      }
    },
  });
  console.log(`Created customer user: ${customer.email}`);

  // 6. Create Coupon
  const coupon = await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      type: CouponType.PERCENTAGE,
      value: 10.0,
      isActive: true,
    },
  });

  // 7. Create Settings
  const settings = [
    { key: 'store_name', value: 'NextJS E-Commerce' },
    { key: 'currency', value: 'EGP' },
    { key: 'contact_email', value: 'support@example.com' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
