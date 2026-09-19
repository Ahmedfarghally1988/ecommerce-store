"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Printer, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/format';

export function InvoicePrintClient({ invoice, storeSettings }: { invoice: any, storeSettings: Record<string, string> }) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'ar';
  
  const handlePrint = () => {
    window.print();
  };

  const storeName = storeSettings['storeNameAr'] || 'المتجر الإلكتروني';
  const storeLogo = storeSettings['storeLogo'];
  const storeAddress = storeSettings['storeAddress'] || '';
  const storePhone = storeSettings['storePhone'] || '';
  const storeEmail = storeSettings['storeEmail'] || '';

  const orderDate = new Date(invoice.createdAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Action bar (Hidden on print) */}
      <div className="flex items-center justify-between print:hidden mb-8">
        <Link
          href={`/${locale}/admin/invoices`}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300 rtl:rotate-180" />
        </Link>
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          طباعة الفاتورة
        </button>
      </div>

      {/* Invoice Paper */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 print:shadow-none print:border-none print:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-gray-200 pb-8 mb-8">
          <div>
            {storeLogo ? (
              <div className="relative w-32 h-12 mb-4">
                <Image src={storeLogo} alt={storeName} fill className="object-contain object-right" />
              </div>
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{storeName}</h1>
            )}
            <div className="text-sm text-gray-600 space-y-1">
              {storeAddress && <p>{storeAddress}</p>}
              {storePhone && <p dir="ltr" className="text-right">{storePhone}</p>}
              {storeEmail && <p>{storeEmail}</p>}
            </div>
          </div>
          <div className="text-left rtl:text-right">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-wide">فاتورة ضريبية</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-semibold">رقم الفاتورة:</span> {invoice.invoiceNumber}</p>
              <p><span className="font-semibold">تاريخ الفاتورة:</span> {orderDate}</p>
              <p><span className="font-semibold">رقم الطلب:</span> {invoice.order?.orderNumber}</p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b-2 border-indigo-500 inline-block pb-1">
            فاتورة إلى
          </h3>
          <div className="text-sm text-gray-800 space-y-1 mt-2">
            <p className="font-bold text-base">{invoice.customerName}</p>
            {invoice.customerEmail && <p>{invoice.customerEmail}</p>}
            {invoice.customerPhone && <p dir="ltr" className="text-right w-fit">{invoice.customerPhone}</p>}
          </div>
        </div>

        {/* Invoice Items */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="px-4 py-3 font-bold text-gray-900">وصف المنتج</th>
                <th className="px-4 py-3 font-bold text-gray-900 w-24">الكمية</th>
                <th className="px-4 py-3 font-bold text-gray-900 w-32">سعر الوحدة</th>
                <th className="px-4 py-3 font-bold text-gray-900 w-32 text-left rtl:text-left">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.order?.items?.map((item: any) => (
                <tr key={item.id}>
                  <td className="px-4 py-4 text-gray-900 font-medium">
                    {locale === 'ar' ? item.productNameAr || item.productNameEn : item.productNameEn || item.productNameAr}
                    <div className="text-xs text-gray-500 mt-1">SKU: {item.sku}</div>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-4 text-gray-700">{formatPrice(Number(item.price), invoice.currency)}</td>
                  <td className="px-4 py-4 text-gray-900 font-bold text-left rtl:text-left">
                    {formatPrice(Number(item.total), invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end border-t border-gray-200 pt-8">
          <div className="w-full max-w-sm space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>المجموع الفرعي</span>
              <span>{formatPrice(Number(invoice.order?.subtotal || invoice.amount), invoice.currency)}</span>
            </div>
            
            {Number(invoice.order?.shipping) > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>تكلفة الشحن</span>
                <span>{formatPrice(Number(invoice.order?.shipping), invoice.currency)}</span>
              </div>
            )}
            
            {Number(invoice.order?.discount) > 0 && (
              <div className="flex justify-between text-red-600">
                <span>الخصم</span>
                <span>-{formatPrice(Number(invoice.order?.discount), invoice.currency)}</span>
              </div>
            )}
            
            {Number(invoice.order?.tax) > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>الضريبة المضافة</span>
                <span>{formatPrice(Number(invoice.order?.tax), invoice.currency)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg text-gray-900 pt-4 border-t border-gray-200">
              <span>الإجمالي المستحق</span>
              <span className="text-indigo-600">{formatPrice(Number(invoice.amount), invoice.currency)}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>شكراً لتسوقكم معنا!</p>
          <p className="mt-1">هذه الفاتورة تم إصدارها إلكترونياً ولا تحتاج إلى توقيع.</p>
        </div>
      </div>
    </div>
  );
}
