"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Banner } from '@prisma/client';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/shared/ui/Button';
import { Input } from '@/components/shared/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/Table';
import { Modal } from '@/components/shared/ui/Modal';
import { useToast } from '@/components/shared/ui/Toast';
import { bannerSchema, BannerInput } from '@/lib/validations/admin';
import { createBanner, updateBanner, deleteBanner, toggleBannerStatus } from '@/app/actions/admin/banners';
import { ImageUpload } from '@/components/admin/ImageUpload';
import Image from 'next/image';

export function BannersClient({ banners }: { banners: Banner[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const { showToast } = useToast();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<BannerInput>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      isActive: true,
      sortOrder: 0,
      image: '',
      position: 'GRID',
    }
  });

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      reset({
        titleEn: banner.titleEn || '',
        titleAr: banner.titleAr || '',
        link: banner.link || '',
        image: banner.image,
        position: banner.position as any,
        isActive: banner.isActive,
        sortOrder: banner.sortOrder,
      });
    } else {
      setEditingBanner(null);
      reset({ titleEn: '', titleAr: '', link: '', image: '', position: 'GRID', isActive: true, sortOrder: 0 });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: BannerInput) => {
    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, data);
        showToast('تم تحديث البانر بنجاح', 'success');
      } else {
        await createBanner(data);
        showToast('تم إنشاء البانر بنجاح', 'success');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      showToast(error.message || 'حدث خطأ ما', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا البانر؟')) {
      try {
        await deleteBanner(id);
        showToast('تم حذف البانر بنجاح', 'success');
      } catch (error: any) {
        showToast('فشل حذف البانر', 'error');
      }
    }
  };

  const handleToggleStatus = async (banner: Banner) => {
    try {
      await toggleBannerStatus(banner.id, !banner.isActive);
      showToast('تم تحديث حالة البانر', 'success');
    } catch (error: any) {
      showToast('فشل تحديث الحالة', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">الإعلانات (البانرات)</h1>
        <Button onClick={() => openModal()}>
          <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
          إضافة بانر
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">الترتيب</TableHead>
            <TableHead>الصورة</TableHead>
            <TableHead>العنوان</TableHead>
            <TableHead>المكان</TableHead>
            <TableHead>الرابط</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-right rtl:text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                لا توجد بانرات.
              </TableCell>
            </TableRow>
          ) : (
            banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell className="font-medium">{banner.sortOrder}</TableCell>
                <TableCell>
                  <div className="relative w-20 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200">
                    <Image src={banner.image} alt={banner.titleAr || 'Banner'} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{banner.titleAr || banner.titleEn || '-'}</TableCell>
                <TableCell>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                    {banner.position === 'SPECIAL_OFFER' ? 'عروض خاصة' : 'الشبكة العادية'}
                  </span>
                </TableCell>
                <TableCell className="text-gray-500 text-sm max-w-[200px] truncate" title={banner.link || ''}>
                  {banner.link || '-'}
                </TableCell>
                <TableCell>
                  <button 
                    onClick={() => handleToggleStatus(banner)}
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium cursor-pointer transition-colors ${banner.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                  >
                    {banner.isActive ? 'نشط' : 'غير نشط'}
                  </button>
                </TableCell>
                <TableCell className="text-right rtl:text-left">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openModal(banner)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(banner.id)}>
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
        title={editingBanner ? 'تعديل البانر' : 'بانر جديد'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('image')} />
          <ImageUpload 
            label="صورة البانر *" 
            value={watch('image') || ''} 
            onChange={(url) => setValue('image', url, { shouldValidate: true })} 
            folder="media"
          />
          {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}

          <div className="grid grid-cols-2 gap-4">
            <Input label="العنوان (عربي) - اختياري" {...register('titleAr')} error={errors.titleAr?.message} />
            <Input label="العنوان (إنجليزي) - اختياري" {...register('titleEn')} error={errors.titleEn?.message} />
          </div>
          
          <Input label="الرابط (Link) - اختياري" placeholder="مثال: /category/shoes" {...register('link')} error={errors.link?.message} />
          
          <Input label="الترتيب (Sort Order)" type="number" {...register('sortOrder')} error={errors.sortOrder?.message} />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مكان العرض *</label>
            <select
              {...register('position')}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="GRID">الشبكة العادية (الرئيسية)</option>
              <option value="SPECIAL_OFFER">عروض خاصة (البانر الكبير)</option>
            </select>
            {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isActive" {...register('isActive')} className="h-4 w-4 rounded border-gray-300" />
            <label htmlFor="isActive" className="text-sm font-medium">نشط (يظهر للعملاء)</label>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
            <Button type="submit" isLoading={isSubmitting}>حفظ البانر</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
