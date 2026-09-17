"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Order, OrderStatus, PaymentStatus } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/Table';
import { useToast } from '@/components/shared/ui/Toast';
import { updateOrderStatus, updatePaymentStatus, deleteOrder } from '@/app/actions/admin/orders';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';
import { Trash2 } from 'lucide-react';

export function OrdersClient({ orders }: { orders: Order[] }) {
  const { showToast } = useToast();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const statusMap: Record<string, string> = {
    PENDING: 'قيد الانتظار',
    PROCESSING: 'جاري التجهيز',
    SHIPPED: 'تم الشحن',
    DELIVERED: 'تم التوصيل',
    CANCELLED: 'ملغي',
    REFUNDED: 'مسترجع',
  };

  const paymentMap: Record<string, string> = {
    PENDING: 'قيد الانتظار',
    PAID: 'مدفوع',
    FAILED: 'فشل الدفع',
    REFUNDED: 'مسترجع',
  };

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, newStatus);
      showToast('تم تحديث حالة الطلب', 'success');
    } catch (error) {
      showToast('فشل تحديث الحالة', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusChange = async (id: string, newStatus: PaymentStatus) => {
    setUpdatingId(id);
    try {
      await updatePaymentStatus(id, newStatus);
      showToast('تم تحديث حالة الدفع', 'success');
    } catch (error) {
      showToast('فشل تحديث حالة الدفع', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب نهائياً؟ لا يمكن التراجع عن هذه العملية.')) return;
    
    setUpdatingId(id);
    try {
      await deleteOrder(id);
      showToast('تم حذف الطلب بنجاح', 'success');
    } catch (error) {
      showToast('فشل حذف الطلب', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">الطلبات</h1>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="بحث برقم الطلب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
          >
            <option value="ALL">جميع الحالات</option>
            {Object.entries(statusMap).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
          >
            <option value="ALL">جميع حالات الدفع</option>
            {Object.entries(paymentMap).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>رقم الطلب</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>العميل</TableHead>
            <TableHead>الجوال</TableHead>
            <TableHead>الإجمالي</TableHead>
            <TableHead>الدفع</TableHead>
            <TableHead className="text-right rtl:text-left">الحالة</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders
            .filter(o => statusFilter === 'ALL' || o.status === statusFilter)
            .filter(o => paymentFilter === 'ALL' || o.paymentStatus === paymentFilter)
            .filter(o => searchQuery === '' || o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()))
            .length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                لا توجد طلبات.
              </TableCell>
            </TableRow>
          ) : (
            orders
              .filter(o => statusFilter === 'ALL' || o.status === statusFilter)
              .filter(o => paymentFilter === 'ALL' || o.paymentStatus === paymentFilter)
              .filter(o => searchQuery === '' || o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((order, index) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium font-mono">
                  <Link href={`/${locale}/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                    #{order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString('en-US')}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{order.customerName}</span>
                    <span className="text-xs text-gray-500">{order.customerEmail}</span>
                  </div>
                </TableCell>
                <TableCell dir="ltr" className="text-left rtl:text-right">{order.customerPhone || '—'}</TableCell>
                <TableCell>{formatPrice(Number(order.total), order.currency || 'EGP')}</TableCell>
                <TableCell>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentStatusChange(order.id, e.target.value as PaymentStatus)}
                    disabled={updatingId === order.id}
                    className="h-8 rounded-md border border-gray-300 bg-transparent px-2 text-xs focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:text-gray-50 disabled:opacity-50"
                  >
                    {Object.entries(paymentMap).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </TableCell>
                <TableCell className="text-right rtl:text-left">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    disabled={updatingId === order.id}
                    className="h-8 rounded-md border border-gray-300 bg-transparent px-2 text-xs focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:text-gray-50 disabled:opacity-50"
                  >
                    {Object.entries(statusMap).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    disabled={updatingId === order.id}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="حذف نهائي"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
