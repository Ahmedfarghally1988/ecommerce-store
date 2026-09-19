"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Order, OrderItem, OrderStatus, PaymentStatus } from '@prisma/client';
import { ArrowRight, User, MapPin, Package, CreditCard, Calendar, Phone, Mail, Edit3, FileText } from 'lucide-react';
import { updateOrderStatus, updatePaymentStatus, adminUpdateOrderAddress } from '@/app/actions/admin/orders';
import { createInvoice } from '@/app/actions/admin/invoices';
import { getShippingSettings } from '@/app/actions/storefront/orders';
import { useToast } from '@/components/shared/ui/Toast';
import { formatPrice } from '@/lib/format';
import { Modal } from '@/components/shared/ui/Modal';

type OrderWithItems = Order & { items: OrderItem[], invoices: any[] };

export function OrderDetailsClient({ order }: { order: OrderWithItems }) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const { showToast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);

  // Edit Address State
  const address = typeof order.shippingAddress === 'string' 
    ? JSON.parse(order.shippingAddress) 
    : order.shippingAddress as any;

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddressData, setEditAddressData] = useState({ 
    city: address?.city || '', 
    address: address?.address || '', 
    apartment: address?.apartment || '', 
    area: address?.area || '' 
  });
  const [shippingSettings, setShippingSettings] = useState<{baseCost: number, freeThreshold: number | null, regions: any[]}>({ baseCost: 0, freeThreshold: null, regions: [] });

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  useEffect(() => {
    getShippingSettings().then(setShippingSettings);
  }, []);

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

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      setStatus(newStatus);
      showToast('تم تحديث حالة الطلب', 'success');
    } catch {
      showToast('فشل تحديث الحالة', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (newStatus: PaymentStatus) => {
    setUpdating(true);
    try {
      await updatePaymentStatus(order.id, newStatus);
      setPaymentStatus(newStatus);
      showToast('تم تحديث حالة الدفع', 'success');
    } catch {
      showToast('فشل تحديث حالة الدفع', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleEditAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await adminUpdateOrderAddress(order.id, editAddressData);
      setIsEditingAddress(false);
      showToast('تم تحديث عنوان التوصيل', 'success');
      // Update local address ref to match visually without a hard refresh
      if (address) {
        address.city = editAddressData.city;
        address.address = editAddressData.address;
        address.apartment = editAddressData.apartment;
        address.area = editAddressData.area;
      }
    } catch {
      showToast('فشل تحديث العنوان', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateInvoice = async () => {
    setCreatingInvoice(true);
    try {
      const res = await createInvoice(order.id);
      if (res?.success) {
        showToast('تم إنشاء الفاتورة بنجاح', 'success');
        setIsInvoiceModalOpen(false);
      } else {
        showToast(res?.error || 'فشل إنشاء الفاتورة', 'error');
      }
    } catch (e) {
      showToast('فشل إنشاء الفاتورة', 'error');
    } finally {
      setCreatingInvoice(false);
    }
  };

  return (
    <div className="space-y-6 w-full ">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/admin/orders`}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300 rtl:rotate-180" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            طلب #{order.orderNumber}
          </h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(order.createdAt).toLocaleString('en-US')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              المنتجات
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-200 border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center font-bold text-gray-400">
                      {item.quantity}x
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {locale === 'ar' ? (item as any).productNameAr || item.productNameEn : (item as any).productNameEn || item.productNameAr}
                      </h3>
                      <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="text-right font-medium text-gray-900 dark:text-gray-100">
                    {formatPrice(Number(item.total), order.currency || 'EGP')}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(Number(order.subtotal), order.currency || 'EGP')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>الشحن</span>
                <span>{formatPrice(Number(order.shipping), order.currency || 'EGP')}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>الخصم</span>
                  <span>-{formatPrice(Number(order.discount), order.currency || 'EGP')}</span>
                </div>
              )}
              {Number(order.tax) > 0 && (
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>الضريبة</span>
                  <span>{formatPrice(Number(order.tax), order.currency || 'EGP')}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-gray-100 pt-2 border-t border-gray-100 dark:border-gray-700">
                <span>الإجمالي</span>
                <span>{formatPrice(Number(order.total), order.currency || 'EGP')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Customer & Status */}
        <div className="space-y-6">
          {/* Status Updates */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">حالة الطلب</label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                disabled={updating}
                className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(statusMap).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">حالة الدفع</label>
              <select
                value={paymentStatus}
                onChange={(e) => handlePaymentStatusChange(e.target.value as PaymentStatus)}
                disabled={updating}
                className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(paymentMap).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {order.status === 'CANCELLED' && (order as any).cancelReason && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800/30 p-6">
              <h2 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2">سبب الإلغاء</h2>
              <p className="text-sm text-red-700 dark:text-red-300">
                {(order as any).cancelReason}
              </p>
            </div>
          )}

          {/* Customer Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              العميل
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {order.customerName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${order.customerEmail}`} className="text-sm text-blue-600 hover:underline">
                  {order.customerEmail}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${order.customerPhone}`} className="text-sm text-blue-600 hover:underline" dir="ltr">
                  {order.customerPhone || 'غير متوفر'}
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                عنوان التوصيل
              </h2>
              <button 
                onClick={() => setIsEditingAddress(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Edit3 className="w-4 h-4" />
                تعديل
              </button>
            </div>
            {address ? (
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {address.firstName} {address.lastName}
                </p>
                <p>{address.address}</p>
                {address.apartment && <p>شقة: {address.apartment}</p>}
                <p>{address.city}{address.area ? `، ${address.area}` : ''}، {address.country}</p>
                <p dir="ltr" className="text-right">{address.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">لا يوجد عنوان توصيل</p>
            )}
          </div>
          
          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              طريقة الدفع
            </h2>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase">
              {order.paymentMethod}
            </p>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-100 dark:border-yellow-800/30 p-6">
              <h2 className="text-lg font-bold text-yellow-900 dark:text-yellow-400 mb-2">ملاحظات إضافية</h2>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-between mt-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            الفواتير
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {order.invoices && order.invoices.length > 0 
              ? `يوجد ${order.invoices.length} فاتورة لهذا الطلب` 
              : 'لم يتم إنشاء أي فاتورة لهذا الطلب بعد.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {order.invoices && order.invoices.length > 0 && (
            <Link 
              href={`/${locale}/admin/invoices/${order.invoices[order.invoices.length - 1].id}`}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-2"
            >
              عرض الفاتورة
            </Link>
          )}
          <button 
            onClick={() => setIsInvoiceModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            إنشاء فاتورة
          </button>
        </div>
      </div>

      {/* Edit Address Modal */}
      <Modal
        isOpen={isEditingAddress}
        onClose={() => setIsEditingAddress(false)}
        title="تعديل عنوان الشحن"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleEditAddressSubmit} className="mt-4 space-y-4 text-right" dir="rtl">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المدينة *</label>
            <select 
              required 
              value={editAddressData.city} 
              onChange={e => setEditAddressData({...editAddressData, city: e.target.value})} 
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="" disabled>اختر المدينة</option>
              {shippingSettings.regions.map(region => (
                <option key={region.name} value={region.name}>{region.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المنطقة (اختياري)</label>
            <input type="text" value={editAddressData.area} onChange={e => setEditAddressData({...editAddressData, area: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان التفصيلي *</label>
            <input required type="text" value={editAddressData.address} onChange={e => setEditAddressData({...editAddressData, address: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الشقة (اختياري)</label>
            <input type="text" value={editAddressData.apartment} onChange={e => setEditAddressData({...editAddressData, apartment: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsEditingAddress(false)} disabled={updating} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
              إلغاء
            </button>
            <button type="submit" disabled={updating} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
              {updating ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : null}
              حفظ التعديلات
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Invoice Confirmation Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => !creatingInvoice && setIsInvoiceModalOpen(false)}
        title="تأكيد إنشاء الفاتورة"
        maxWidth="max-w-md"
      >
        <div className="p-4 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            هل تريد بالتأكيد إنشاء فاتورة لهذا الطلب؟
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button 
              type="button" 
              onClick={() => setIsInvoiceModalOpen(false)} 
              disabled={creatingInvoice}
              className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              إلغاء
            </button>
            <button 
              type="button" 
              onClick={handleCreateInvoice}
              disabled={creatingInvoice}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
            >
              {creatingInvoice ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : null}
              موافق
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
