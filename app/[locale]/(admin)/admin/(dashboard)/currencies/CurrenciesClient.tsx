"use client";

import { useState, useTransition } from 'react';
import { Currency } from '@prisma/client';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/shared/ui/Button';
import { Input } from '@/components/shared/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/Table';
import { Modal } from '@/components/shared/ui/Modal';
import { useToast } from '@/components/shared/ui/Toast';
import { createCurrency, updateCurrency, deleteCurrency } from '@/app/actions/admin/currencies';
import { useRouter } from 'next/navigation';

export function CurrenciesClient({ currencies }: { currencies: Currency[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    code: '',
    nameEn: '',
    nameAr: '',
    symbol: '',
    exchangeRate: 1,
    isActive: true,
    isBase: false,
  });

  const openModal = (curr?: Currency) => {
    if (curr) {
      setEditingCurrency(curr);
      setFormData({
        code: curr.code,
        nameEn: curr.nameEn,
        nameAr: curr.nameAr,
        symbol: curr.symbol,
        exchangeRate: Number(curr.exchangeRate),
        isActive: curr.isActive,
        isBase: curr.isBase,
      });
    } else {
      setEditingCurrency(null);
      setFormData({
        code: '',
        nameEn: '',
        nameAr: '',
        symbol: '',
        exchangeRate: 1,
        isActive: true,
        isBase: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.nameEn || !formData.nameAr || !formData.symbol || !formData.exchangeRate) {
      showToast('الرجاء إدخال جميع الحقول المطلوبة', 'error');
      return;
    }
    
    startTransition(async () => {
      let res;
      if (editingCurrency) {
        res = await updateCurrency(editingCurrency.id, formData);
      } else {
        res = await createCurrency(formData);
      }

      if (res.success) {
        showToast(editingCurrency ? 'تم التحديث بنجاح' : 'تمت الإضافة بنجاح', 'success');
        setIsModalOpen(false);
        router.refresh();
      } else {
        showToast(res.error || 'حدث خطأ ما', 'error');
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه العملة؟')) {
      startTransition(async () => {
        const res = await deleteCurrency(id);
        if (res.success) {
          showToast('تم الحذف بنجاح', 'success');
          router.refresh();
        } else {
          showToast(res.error || 'فشل الحذف', 'error');
        }
      });
    }
  };

  const toggleStatus = async (curr: Currency) => {
    if (curr.isBase) {
      showToast('لا يمكن تعطيل العملة الأساسية', 'error');
      return;
    }
    startTransition(async () => {
      const res = await updateCurrency(curr.id, { ...curr, exchangeRate: Number(curr.exchangeRate), isActive: !curr.isActive });
      if (res.success) {
        showToast('تم التحديث', 'success');
        router.refresh();
      } else {
        showToast(res.error || 'فشل التحديث', 'error');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">العملات</h1>
        <Button onClick={() => openModal()}>
          <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
          إضافة عملة
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الكود</TableHead>
            <TableHead>الاسم</TableHead>
            <TableHead>الرمز</TableHead>
            <TableHead>سعر الصرف</TableHead>
            <TableHead>العملة الأساسية</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-left rtl:text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currencies.map((curr) => (
            <TableRow key={curr.id}>
              <TableCell className="font-semibold">{curr.code}</TableCell>
              <TableCell>{curr.nameAr} / {curr.nameEn}</TableCell>
              <TableCell>{curr.symbol}</TableCell>
              <TableCell>{Number(curr.exchangeRate)}</TableCell>
              <TableCell>
                {curr.isBase ? (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">نعم</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                <button
                  onClick={() => toggleStatus(curr)}
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    curr.isActive
                      ? 'bg-green-50 text-green-700 ring-green-600/20 hover:bg-green-100'
                      : 'bg-red-50 text-red-700 ring-red-600/10 hover:bg-red-100'
                  }`}
                >
                  {curr.isActive ? 'مفعل' : 'معطل'}
                </button>
              </TableCell>
              <TableCell className="text-left rtl:text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => openModal(curr)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {!curr.isBase && (
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(curr.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {currencies.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                لا توجد عملات.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCurrency ? 'تعديل عملة' : 'إضافة عملة'}>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">كود العملة (مثل: USD, EUR, EGP) *</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                disabled={!!editingCurrency}
                placeholder="EGP"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">الرمز (مثل: $, €, ج.م) *</label>
              <Input
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                placeholder="ج.م"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">الاسم (إنجليزي) *</label>
              <Input
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="Egyptian Pound"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">الاسم (عربي) *</label>
              <Input
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder="جنيه مصري"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">سعر الصرف مقابل العملة الأساسية *</label>
            <Input
              type="number"
              step="0.0001"
              value={formData.exchangeRate}
              onChange={(e) => setFormData({ ...formData, exchangeRate: parseFloat(e.target.value) })}
              disabled={formData.isBase}
              required
            />
            <p className="text-xs text-gray-500 mt-1">إذا كانت هذه هي العملة الأساسية، سعر الصرف يجب أن يكون 1.</p>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-black focus:ring-black"
                disabled={formData.isBase}
              />
              <span className="text-sm font-medium">مفعلة</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBase}
                onChange={(e) => {
                  const isBase = e.target.checked;
                  setFormData({ ...formData, isBase, exchangeRate: isBase ? 1 : formData.exchangeRate, isActive: isBase ? true : formData.isActive });
                }}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm font-medium">تعيين كعملة أساسية</span>
            </label>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
