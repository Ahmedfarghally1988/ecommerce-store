"use client";

import { useState, useTransition } from 'react';
import { Country, Currency } from '@prisma/client';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/shared/ui/Button';
import { Input } from '@/components/shared/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/Table';
import { Modal } from '@/components/shared/ui/Modal';
import { useToast } from '@/components/shared/ui/Toast';
import { createCountry, updateCountry, deleteCountry } from '@/app/actions/admin/countries';
import { useRouter } from 'next/navigation';

export function CountriesClient({ countries, currencies }: { countries: (Country & { currency: Currency })[], currencies: Currency[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    code: '',
    nameEn: '',
    nameAr: '',
    currencyId: '',
    isActive: true,
  });

  const openModal = (country?: Country) => {
    if (country) {
      setEditingCountry(country);
      setFormData({
        code: country.code,
        nameEn: country.nameEn,
        nameAr: country.nameAr,
        currencyId: country.currencyId,
        isActive: country.isActive,
      });
    } else {
      setEditingCountry(null);
      setFormData({
        code: '',
        nameEn: '',
        nameAr: '',
        currencyId: currencies.length > 0 ? currencies[0].id : '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.nameEn || !formData.nameAr || !formData.currencyId) {
      showToast('الرجاء إدخال جميع الحقول المطلوبة', 'error');
      return;
    }
    
    startTransition(async () => {
      let res;
      if (editingCountry) {
        res = await updateCountry(editingCountry.id, formData);
      } else {
        res = await createCountry(formData);
      }

      if (res.success) {
        showToast(editingCountry ? 'تم التحديث بنجاح' : 'تمت الإضافة بنجاح', 'success');
        setIsModalOpen(false);
        router.refresh();
      } else {
        showToast(res.error || 'حدث خطأ ما', 'error');
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الدولة؟')) {
      startTransition(async () => {
        const res = await deleteCountry(id);
        if (res.success) {
          showToast('تم الحذف بنجاح', 'success');
          router.refresh();
        } else {
          showToast(res.error || 'فشل الحذف', 'error');
        }
      });
    }
  };

  const toggleStatus = async (country: Country) => {
    startTransition(async () => {
      const res = await updateCountry(country.id, { ...country, isActive: !country.isActive });
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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">الدول والمناطق</h1>
        <Button onClick={() => openModal()}>
          <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
          إضافة دولة
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الكود</TableHead>
            <TableHead>الاسم</TableHead>
            <TableHead>العملة المرتبطة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-left rtl:text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {countries.map((country) => (
            <TableRow key={country.id}>
              <TableCell className="font-semibold">{country.code}</TableCell>
              <TableCell>{country.nameAr} / {country.nameEn}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {country.currency?.nameAr} ({country.currency?.code})
                </span>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => toggleStatus(country)}
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    country.isActive
                      ? 'bg-green-50 text-green-700 ring-green-600/20 hover:bg-green-100'
                      : 'bg-red-50 text-red-700 ring-red-600/10 hover:bg-red-100'
                  }`}
                >
                  {country.isActive ? 'مفعل' : 'معطل'}
                </button>
              </TableCell>
              <TableCell className="text-left rtl:text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => openModal(country)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(country.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {countries.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                لا توجد دول مضافة.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCountry ? 'تعديل دولة' : 'إضافة دولة'}>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">كود الدولة (مثل: EG, SA, OTHER) *</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                disabled={!!editingCountry}
                placeholder="EG"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">العملة المرتبطة *</label>
              <select
                value={formData.currencyId}
                onChange={(e) => setFormData({ ...formData, currencyId: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="" disabled>اختر العملة</option>
                {currencies.map(curr => (
                  <option key={curr.id} value={curr.id}>{curr.nameAr} ({curr.code})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">الاسم (إنجليزي) *</label>
              <Input
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="Egypt"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">الاسم (عربي) *</label>
              <Input
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder="مصر"
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm font-medium">مفعلة</span>
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
