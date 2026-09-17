"use client";

import React, { useState, useEffect } from 'react';
import { Package, ChevronRight, ChevronDown, XCircle, Edit3 } from 'lucide-react';
import { cancelCustomerOrder, updateCustomerOrderAddress } from '@/app/actions/customer/orders';
import { getShippingSettings } from '@/app/actions/storefront/orders';
import { Modal } from '@/components/shared/ui/Modal';
import { useRouter } from 'next/navigation';

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

interface OrdersListClientProps {
  orders: any[];
  locale: string;
}

export default function OrdersListClient({ orders, locale }: OrdersListClientProps) {
  const isAr = locale === 'ar';
  const router = useRouter();
  
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Cancel Order Modal State
  const [orderToCancel, setOrderToCancel] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const [orderToEdit, setOrderToEdit] = useState<any | null>(null);
  const [editAddressData, setEditAddressData] = useState({ city: '', address: '', apartment: '', area: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [shippingSettings, setShippingSettings] = useState<{baseCost: number, freeThreshold: number | null, regions: any[]}>({ baseCost: 0, freeThreshold: null, regions: [] });

  useEffect(() => {
    getShippingSettings().then(setShippingSettings);
  }, []);

  const toggleExpand = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderToCancel) return;

    setIsCancelling(true);
    try {
      await cancelCustomerOrder(orderToCancel.id, cancelReason);
      setOrderToCancel(null);
      setCancelReason('');
      router.refresh();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert(isAr ? 'حدث خطأ أثناء إلغاء الطلب' : 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderToEdit) return;

    setIsEditing(true);
    try {
      await updateCustomerOrderAddress(orderToEdit.id, editAddressData);
      setOrderToEdit(null);
      router.refresh();
    } catch (error) {
      console.error('Failed to update address:', error);
      alert(isAr ? 'حدث خطأ أثناء تعديل العنوان' : 'Failed to update address');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order: any) => {
        const isExpanded = expandedOrderId === order.id;
        const canCancel = order.status === 'PENDING' || order.status === 'PROCESSING';

        return (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-colors">
            {/* Accordion Header */}
            <div 
              onClick={() => toggleExpand(order.id)}
              className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-gray-900">#{order.orderNumber}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {isAr ? STATUS_LABELS_AR[order.status] : order.status}
                  </span>
                  <span className="font-bold text-lg text-gray-900">
                    {Number(order.total).toLocaleString('en-US')} {order.currency}
                  </span>
                  <div className="text-gray-400">
                    {isExpanded ? <ChevronDown /> : (isAr ? <ChevronRight className="rotate-180" /> : <ChevronRight />)}
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion Content */}
            {isExpanded && (
              <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                <h4 className="font-bold text-gray-900 mb-4">{isAr ? 'المنتجات المطلوبة' : 'Order Items'}</h4>
                
                <div className="space-y-3 mb-6">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="font-bold text-gray-500 bg-gray-100 w-8 h-8 flex items-center justify-center rounded-md">
                          {item.quantity}x
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{isAr ? item.productNameAr : item.productNameEn}</p>
                          <p className="text-xs text-gray-500">{item.sku}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-700 whitespace-nowrap ml-4">
                        {(Number(item.price) * item.quantity).toLocaleString('en-US')} {order.currency}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-2">
                  <div className="text-sm text-gray-500">
                    {order.paymentMethod === 'cod' ? (isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery') : order.paymentMethod}
                  </div>
                  
                  {order.notes && (
                    <div className="text-sm text-gray-500 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-100 max-w-sm ml-auto mr-auto">
                      <span className="font-semibold text-yellow-800">{isAr ? 'ملاحظات:' : 'Notes:'}</span> <span className="text-yellow-700">{order.notes}</span>
                    </div>
                  )}

                  {canCancel && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOrderToEdit(order);
                          const addr = order.shippingAddress || {};
                          setEditAddressData({
                            city: addr.city || '',
                            address: addr.address || '',
                            apartment: addr.apartment || '',
                            area: addr.area || ''
                          });
                        }}
                        className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        {isAr ? 'تعديل العنوان' : 'Edit Address'}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOrderToEdit(null);
                          setOrderToCancel(order);
                        }}
                        className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        {isAr ? 'إلغاء الطلب' : 'Cancel Order'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Cancel Order Modal */}
      <Modal
        isOpen={!!orderToCancel}
        onClose={() => setOrderToCancel(null)}
        title={isAr ? 'إلغاء الطلب' : 'Cancel Order'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCancelSubmit} className="mt-4">
          <p className="text-sm text-gray-600 mb-4">
            {isAr 
              ? `هل أنت متأكد من رغبتك في إلغاء الطلب رقم #${orderToCancel?.orderNumber}؟ يمكنك توضيح السبب (اختياري).` 
              : `Are you sure you want to cancel order #${orderToCancel?.orderNumber}? You can provide a reason (optional).`}
          </p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isAr ? 'سبب الإلغاء (اختياري)' : 'Reason for cancellation (Optional)'}
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
              rows={3}
              placeholder={isAr ? 'أخبرنا بالسبب لنتحسن مستقبلاً...' : 'Tell us why...'}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOrderToCancel(null)}
              disabled={isCancelling}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              {isAr ? 'تراجع' : 'Back'}
            </button>
            <button
              type="submit"
              disabled={isCancelling}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {isCancelling && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              )}
              {isAr ? 'تأكيد الإلغاء' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        isOpen={!!orderToEdit}
        onClose={() => setOrderToEdit(null)}
        title={isAr ? 'تعديل عنوان الشحن' : 'Edit Shipping Address'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'المدينة' : 'City'} *</label>
            <select 
              required 
              value={editAddressData.city} 
              onChange={e => setEditAddressData({...editAddressData, city: e.target.value})} 
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="" disabled>{isAr ? 'اختر المدينة' : 'Select City'}</option>
              {shippingSettings.regions.map(region => (
                <option key={region.name} value={region.name}>{region.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'المنطقة (اختياري)' : 'Area (Optional)'}</label>
            <input type="text" value={editAddressData.area} onChange={e => setEditAddressData({...editAddressData, area: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'العنوان التفصيلي' : 'Address'} *</label>
            <input required type="text" value={editAddressData.address} onChange={e => setEditAddressData({...editAddressData, address: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'رقم الشقة (اختياري)' : 'Apartment (Optional)'}</label>
            <input type="text" value={editAddressData.apartment} onChange={e => setEditAddressData({...editAddressData, apartment: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setOrderToEdit(null)} disabled={isEditing} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              {isAr ? 'تراجع' : 'Cancel'}
            </button>
            <button type="submit" disabled={isEditing} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
              {isEditing ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : null}
              {isAr ? 'حفظ التغييرات' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
