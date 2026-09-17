import prisma from '@/lib/prisma';
import Link from 'next/link';
import { requireAdminPermission } from '@/lib/permissions';
import { getStoreCurrency } from '@/lib/settings';
import { formatPrice } from '@/lib/format';
import { DollarSign, Package, Tags, Users, Eye, UserCircle } from 'lucide-react';
import SalesChart from '@/components/admin/SalesChart';
import PeriodSelect from '@/components/admin/PeriodSelect';
import PieChartWidget from '@/components/admin/PieChartWidget';

export default async function AdminDashboardPage(props: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  await requireAdminPermission('dashboard.view');
  
  const searchParams = await props.searchParams;
  const { locale } = await props.params;
  const period = searchParams?.period as string;
  
  let dateFilter = {};
  if (period) {
    const now = new Date();
    if (period === 'today') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateFilter = { gte: startOfDay };
    } else if (period === '7days') {
      const startOf7Days = new Date(now.setDate(now.getDate() - 7));
      dateFilter = { gte: startOf7Days };
    } else if (period === '30days') {
      const startOf30Days = new Date(now.setDate(now.getDate() - 30));
      dateFilter = { gte: startOf30Days };
    } else if (period === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { gte: startOfMonth };
    }
  }

  const currency = await getStoreCurrency();
  const [
    productsCount,
    ordersCount,
    customersCount,
    pendingCount,
    revenueData,
    recentOrders,
    lowStockProducts,
    visitorsSetting,
    allOrders,
    usersCount,
    orderItemsForStats,
    ordersForCities,
    reviewsForStats,
    topCoupons
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ 
      where: Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : undefined 
    }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({ where: { role: 'CUSTOMER', customerStatus: 'PENDING' } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { 
        status: { notIn: ['CANCELLED', 'REFUNDED'] },
        ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {})
      }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    }),
    prisma.product.findMany({
      where: { stock: { lte: 10 } },
      take: 5,
      orderBy: { stock: 'asc' }
    }),
    prisma.setting.findUnique({
      where: { key: 'site_visits' }
    }),
    prisma.order.findMany({
      where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: 'asc' }
    }),
    prisma.user.count(),
    prisma.orderItem.findMany({
      where: { order: { status: { notIn: ['CANCELLED', 'REFUNDED'] }, ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}) } },
      select: {
        productNameAr: true,
        productId: true,
        total: true
      }
    }),
    prisma.order.findMany({
      where: { status: { notIn: ['CANCELLED', 'REFUNDED'] }, ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}) },
      select: { shippingAddress: true, total: true }
    }),
    prisma.review.groupBy({
      by: ['rating'],
      _count: { rating: true }
    }),
    prisma.coupon.findMany({
      where: { usedCount: { gt: 0 } },
      orderBy: { usedCount: 'desc' },
      take: 5
    })
  ]);

  const totalRevenue = revenueData._sum.total ? Number(revenueData._sum.total) : 0;
  const visitorsCount = visitorsSetting ? parseInt(visitorsSetting.value || '0', 10) : 0;

  // Process data for the monthly sales chart
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const currentYear = new Date().getFullYear();
  
  const monthlyData = months.map((month, index) => {
    return { name: month, المبيعات: 0, index };
  });

  allOrders.forEach(order => {
    const orderDate = new Date(order.createdAt);
    if (orderDate.getFullYear() === currentYear) {
      const monthIndex = orderDate.getMonth();
      monthlyData[monthIndex].المبيعات += Number(order.total);
    }
  });

  // Filter out future months if desired, or just show all
  const chartData = monthlyData.slice(0, new Date().getMonth() + 1);

  // Fetch product info to get categories and brands
  const uniqueProductIds = Array.from(new Set(orderItemsForStats.map(item => item.productId).filter(Boolean))) as string[];
  const productsWithCatBrand = await prisma.product.findMany({
    where: { id: { in: uniqueProductIds } },
    select: {
      id: true,
      category: { select: { nameAr: true } },
      brand: { select: { nameAr: true } }
    }
  });

  const productInfoMap = new Map(productsWithCatBrand.map(p => [p.id, p]));

  // Process data for pie charts
  const topProductsMap = new Map<string, number>();
  const topCategoriesMap = new Map<string, number>();
  const topBrandsMap = new Map<string, number>();

  orderItemsForStats.forEach(item => {
    const val = Number(item.total);
    // Products
    const prodName = item.productNameAr || 'منتج غير معروف';
    topProductsMap.set(prodName, (topProductsMap.get(prodName) || 0) + val);
    
    const productInfo = item.productId ? productInfoMap.get(item.productId) : null;

    // Categories
    const catName = productInfo?.category?.nameAr || 'غير مصنف';
    topCategoriesMap.set(catName, (topCategoriesMap.get(catName) || 0) + val);

    // Brands
    if (productInfo?.brand) {
      const brandName = productInfo.brand.nameAr || 'بدون ماركة';
      topBrandsMap.set(brandName, (topBrandsMap.get(brandName) || 0) + val);
    }
  });

  const getTopN = (map: Map<string, number>, n: number = 5) => {
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, n);
  };

  const topProductsData = getTopN(topProductsMap);
  const topCategoriesData = getTopN(topCategoriesMap);
  const topBrandsData = getTopN(topBrandsMap);

  // Process Cities
  const topCitiesMap = new Map<string, number>();
  ordersForCities.forEach(order => {
    let city = 'غير معروف';
    try {
      if (order.shippingAddress && typeof order.shippingAddress === 'object') {
        city = (order.shippingAddress as any).city || 'غير معروف';
      }
    } catch(e) {}
    topCitiesMap.set(city, (topCitiesMap.get(city) || 0) + Number(order.total));
  });
  const topCitiesData = getTopN(topCitiesMap);

  // Process Reviews
  const reviewsData = reviewsForStats.map(r => ({
    name: `${r.rating} نجوم`,
    value: r._count.rating
  })).sort((a, b) => b.name.localeCompare(a.name));

  // Process Coupons
  const topCouponsData = topCoupons.map(c => ({
    name: c.code,
    value: c.usedCount
  }));

  const salesPieData = chartData.map(item => ({
    name: item.name,
    value: item.المبيعات
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">نظرة عامة</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">عرض بيانات:</span>
          <PeriodSelect />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي المبيعات</h3>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">{formatPrice(totalRevenue, currency)}</p>
        </div>
        
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">الطلبات</h3>
            <Package className="h-5 w-5 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">{ordersCount}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">المنتجات</h3>
            <Tags className="h-5 w-5 text-purple-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">{productsCount}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">العملاء</h3>
            <Users className="h-5 w-5 text-orange-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">{customersCount}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">المستخدمين</h3>
            <UserCircle className="h-5 w-5 text-indigo-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">{usersCount}</p>
        </div>
        
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">الزوار</h3>
            <Eye className="h-5 w-5 text-cyan-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">{visitorsCount}</p>
        </div>
      </div>

      {/* Pending Customers Alert */}
      {pendingCount > 0 && (
        <Link href={`/${locale}/admin/customers`} className="block rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 p-5 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300">
                ⏳ {pendingCount} {pendingCount === 1 ? 'عميل بانتظار' : 'عملاء بانتظار'} الموافقة
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                انقر هنا لمراجعة الحسابات المعلقة والموافقة عليها.
              </p>
            </div>
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{pendingCount}</span>
          </div>
        </Link>
      )}

      {/* Pie Charts Reports */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <PieChartWidget title="أكثر المنتجات مبيعاً" data={topProductsData} currency={currency} isCurrency={true} />
        <PieChartWidget title="الأقسام الأكثر مبيعاً" data={topCategoriesData} currency={currency} isCurrency={true} />
        <PieChartWidget title="الماركات الأكثر مبيعاً" data={topBrandsData} currency={currency} isCurrency={true} />
        <PieChartWidget title="أكثر المدن مبيعاً" data={topCitiesData} currency={currency} isCurrency={true} />
        <PieChartWidget title="توزيع التقييمات" data={reviewsData} isCurrency={false} />
        <PieChartWidget title="أكثر الكوبونات استخداماً" data={topCouponsData} isCurrency={false} />
      </div>

      {/* Reports / Tables */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 mt-8">
        {/* Sales Chart */}
        <div className="lg:col-span-4 h-full">
          <div className="h-full">
            <PieChartWidget title="إحصائيات المبيعات الشهرية" data={salesPieData} currency={currency} isCurrency={true} layout="vertical" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-8 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-red-500">⚠️</span> نواقص المخزون
            </h3>
            <Link href={`/${locale}/admin/products`} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              إدارة المنتجات &larr;
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50/50 dark:bg-gray-900/20 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3 font-medium">المنتج</th>
                  <th className="px-6 py-3 font-medium">SKU</th>
                  <th className="px-6 py-3 font-medium text-left">المخزون المتوفر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {lowStockProducts.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">المخزون ممتاز، لا توجد نواقص!</td>
                  </tr>
                ) : (
                  lowStockProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                        <Link href={`/${locale}/admin/products/${product.id}/edit`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {product.nameAr || product.nameEn}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{product.sku}</td>
                      <td className="px-6 py-4 text-left">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold
                          ${product.stock === 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                          {product.stock === 0 ? 'نفدت الكمية' : `${product.stock} قطع متبقية`}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-12 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
            <h3 className="font-semibold text-gray-900 dark:text-white">أحدث الطلبات</h3>
            <Link href={`/${locale}/admin/orders`} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              عرض الكل &larr;
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50/50 dark:bg-gray-900/20 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3 font-medium">رقم الطلب</th>
                  <th className="px-6 py-3 font-medium">العميل</th>
                  <th className="px-6 py-3 font-medium">التاريخ</th>
                  <th className="px-6 py-3 font-medium">المبلغ</th>
                  <th className="px-6 py-3 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">لا توجد طلبات بعد</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                        <Link href={`/${locale}/admin/orders/${order.id}`}>#{order.orderNumber}</Link>
                      </td>
                      <td className="px-6 py-4">{order.customerName}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }).format(new Date(order.createdAt))}
                      </td>
                      <td className="px-6 py-4 font-bold">{formatPrice(Number(order.total), order.currency)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                          ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                            order.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
