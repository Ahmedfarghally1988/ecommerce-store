import prisma from '@/lib/prisma';
import { ProductsClient } from './ProductsClient';
import { requireAdminPermission } from '@/lib/permissions';



export default async function ProductsPage() {
  await requireAdminPermission('products.view');
  const products = await prisma.product.findMany({
    include: {
      category: true,
      brand: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return <ProductsClient products={JSON.parse(JSON.stringify(products))} />;
}
