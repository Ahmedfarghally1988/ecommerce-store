import { getCustomerOrders } from '@/app/actions/customer/orders';
import Link from 'next/link';
import { ShoppingBag, ChevronRight, Package } from 'lucide-react';
import OrdersListClient from '@/components/storefront/orders/OrdersListClient';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
};

const STATUS_LABELS_AR: Record<string, string> = {
  PENDING: 'قيد الانتظار',
  CONFIRMED: 'تم التأكيد',
  PROCESSING: 'قيد المعالجة',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التسليم',
  CANCELLED: 'ملغي',
  REFUNDED: 'تم الاسترداد',
};

export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const orders = await getCustomerOrders();

  return (
    <div className="space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          {isAr ? 'طلباتي' : 'My Orders'}
        </h2>
        <p className="text-sm text-gray-500">
          {isAr ? `إجمالي ${orders.length} طلب` : `${orders.length} total order${orders.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}</h3>
          <p className="text-sm text-gray-500 mb-6">{isAr ? 'تفضل بتصفح متجرنا وإتمام أول طلب لك!' : 'Browse our store and place your first order!'}</p>
          <Link href={`/${locale}/products`} className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
            {isAr ? 'تصفح المنتجات' : 'Browse Products'}
          </Link>
        </div>
      ) : (
        <OrdersListClient orders={orders} locale={locale} />
      )}
    </div>
  );
}
