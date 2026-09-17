"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Coupon } from '@prisma/client';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/shared/ui/Button';
import { Input } from '@/components/shared/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/Table';
import { Modal } from '@/components/shared/ui/Modal';
import { useToast } from '@/components/shared/ui/Toast';
import { couponSchema, CouponInput } from '@/lib/validations/admin';
import { createCoupon, updateCoupon, deleteCoupon } from '@/app/actions/admin/coupons';

export function CouponsClient({ coupons }: { coupons: Coupon[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const { showToast } = useToast();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CouponInput>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      type: 'PERCENTAGE',
      isActive: true,
      value: 10,
    }
  });

  const openModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      reset({
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
        minimumOrder: coupon.minimumOrder ? Number(coupon.minimumOrder) : null,
        maximumDiscount: coupon.maximumDiscount ? Number(coupon.maximumDiscount) : null,
        usageLimit: coupon.usageLimit,
        isActive: coupon.isActive,
        startsAt: coupon.startsAt ? new Date(coupon.startsAt).toISOString().slice(0, 16) : null,
        expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : null,
      });
    } else {
      setEditingCoupon(null);
      reset({ 
        code: '', 
        type: 'PERCENTAGE', 
        value: 10, 
        isActive: true,
        minimumOrder: null,
        maximumDiscount: null,
        usageLimit: null,
        startsAt: null,
        expiresAt: null
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: CouponInput) => {
    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, data);
        showToast('تم تحديث الكوبون بنجاح', 'success');
      } else {
        await createCoupon(data);
        showToast('تم إنشاء الكوبون بنجاح', 'success');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      showToast(error.message || 'حدث خطأ ما', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكوبون؟')) {
      try {
        await deleteCoupon(id);
        showToast('تم حذف الكوبون بنجاح', 'success');
      } catch (error: any) {
        showToast('فشل حذف الكوبون', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">الكوبونات</h1>
        <Button onClick={() => openModal()}>
          <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
          إضافة كوبون
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>الكود</TableHead>
            <TableHead>الخصم</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الاستخدام</TableHead>
            <TableHead className="text-right rtl:text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                لا توجد كوبونات.
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon, index) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium font-mono">{coupon.code}</TableCell>
                <TableCell>
                  {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `$${coupon.value}`}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {coupon.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </TableCell>
                <TableCell>{coupon.usedCount}</TableCell>
                <TableCell className="text-right rtl:text-left">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openModal(coupon)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(coupon.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCoupon ? 'تعديل الكوبون' : 'كوبون جديد'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="الكود" {...register('code')} error={errors.code?.message} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">النوع</label>
              <select 
                {...register('type')}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:text-gray-50"
              >
                <option value="PERCENTAGE">نسبة مئوية</option>
                <option value="FIXED">مبلغ ثابت</option>
              </select>
            </div>
            <Input label="القيمة" type="number" step="0.01" {...register('value')} error={errors.value?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="الحد الأدنى للطلب" type="number" step="0.01" {...register('minimumOrder')} error={errors.minimumOrder?.message} />
            <Input label="أقصى خصم (للنسبة)" type="number" step="0.01" {...register('maximumDiscount')} error={errors.maximumDiscount?.message} />
          </div>
          
          <Input label="حد الاستخدام (الإجمالي)" type="number" {...register('usageLimit')} error={errors.usageLimit?.message} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="تاريخ البدء" type="datetime-local" {...register('startsAt')} error={errors.startsAt?.message} />
            <Input label="تاريخ الانتهاء" type="datetime-local" {...register('expiresAt')} error={errors.expiresAt?.message} />
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="couponActive" {...register('isActive')} className="h-4 w-4 rounded border-gray-300" />
            <label htmlFor="couponActive" className="text-sm font-medium">نشط</label>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
            <Button type="submit" isLoading={isSubmitting}>حفظ</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
