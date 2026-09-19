"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FileText, Search, Filter, Printer, ExternalLink, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/Table';
import { formatPrice } from '@/lib/format';
import { deleteInvoice } from '@/app/actions/admin/invoices';
import { useToast } from '@/components/shared/ui/Toast';
import { Modal } from '@/components/shared/ui/Modal';

export function InvoicesClient({ initialInvoices, currentFilters }: { initialInvoices: any[], currentFilters: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = pathname.split('/')[1] || 'ar';
  
  const [orderNumber, setOrderNumber] = useState(currentFilters.orderNumber || '');
  const [dateFrom, setDateFrom] = useState(currentFilters.dateFrom || '');
  const [dateTo, setDateTo] = useState(currentFilters.dateTo || '');
  const [month, setMonth] = useState(currentFilters.month || '');

  const { showToast } = useToast();
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (orderNumber) params.set('orderNumber', orderNumber);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    if (month) params.set('month', month);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setOrderNumber('');
    setDateFrom('');
    setDateTo('');
    setMonth('');
    router.push(pathname);
  };

  const handleDelete = async () => {
    if (!invoiceToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteInvoice(invoiceToDelete);
      if (res.success) {
        showToast('تم حذف الفاتورة بنجاح', 'success');
        setInvoiceToDelete(null);
        router.refresh();
      } else {
        showToast(res.error || 'فشل الحذف', 'error');
      }
    } catch {
      showToast('حدث خطأ غير متوقع', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-0 pb-20 print:pb-0">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-500" />
          فواتير الطلبات
        </h1>
        <button
          onClick={handlePrint}
          className="px-5 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          طباعة الجدول
        </button>
      </div>

      <div className="hidden print:block mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-900">تقرير الفواتير</h1>
        <p className="text-center text-gray-600 mt-2">
          تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 print:hidden">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">تصفية الفواتير</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الطلب</label>
            <input 
              type="text" 
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="مثال: ORD-123" 
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">شهر محدد</label>
            <input 
              type="month" 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">من تاريخ</label>
            <input 
              type="date" 
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">إلى تاريخ</label>
            <input 
              type="date" 
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button 
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            مسح الفلاتر
          </button>
          <button 
            onClick={applyFilters}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            بحث
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>رقم الفاتورة</TableHead>
            <TableHead>رقم الطلب</TableHead>
            <TableHead>تاريخ الإنشاء</TableHead>
            <TableHead className="print:hidden">العميل</TableHead>
            <TableHead>المبلغ</TableHead>
            <TableHead className="text-right rtl:text-left print:hidden">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialInvoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-12">
                لا توجد فواتير مطابقة لبحثك.
              </TableCell>
            </TableRow>
          ) : (
            initialInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                  {invoice.invoiceNumber}
                </TableCell>
                <TableCell>
                  <Link href={`/${locale}/admin/orders/${invoice.orderId}`} className="text-blue-600 hover:underline font-medium">
                    {invoice.order?.orderNumber || 'طلب محذوف'}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-500 dark:text-gray-400">
                  {new Date(invoice.createdAt).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className="print:hidden">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{invoice.customerName || '-'}</span>
                    <span className="text-xs text-gray-500">{invoice.customerPhone || invoice.customerEmail}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-gray-900 dark:text-gray-100">
                  {formatPrice(Number(invoice.amount), invoice.currency)}
                </TableCell>
                <TableCell className="text-right rtl:text-left print:hidden">
                  <div className="flex justify-end gap-2">
                    <Link 
                      href={`/${locale}/admin/invoices/${invoice.id}`}
                      title="فتح الفاتورة"
                      className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => setInvoiceToDelete(invoice.id)}
                      title="حذف الفاتورة"
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={!!invoiceToDelete}
        onClose={() => !isDeleting && setInvoiceToDelete(null)}
        title="تأكيد الحذف"
        maxWidth="max-w-md"
      >
        <div className="p-4 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            هل أنت متأكد من رغبتك في حذف هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setInvoiceToDelete(null)}
              disabled={isDeleting}
              className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
            >
              إلغاء
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              {isDeleting ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : null}
              نعم، احذف الفاتورة
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
