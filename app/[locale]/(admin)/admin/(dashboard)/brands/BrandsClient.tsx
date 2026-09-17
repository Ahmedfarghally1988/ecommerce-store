"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brand } from '@prisma/client';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/shared/ui/Button';
import { Input } from '@/components/shared/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/Table';
import { Modal } from '@/components/shared/ui/Modal';
import { useToast } from '@/components/shared/ui/Toast';
import { brandSchema, BrandInput } from '@/lib/validations/admin';
import { createBrand, updateBrand, deleteBrand } from '@/app/actions/admin/brands';
import { ImageUpload } from '@/components/admin/ImageUpload';

export function BrandsClient({ brands }: { brands: Brand[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const { showToast } = useToast();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<BrandInput>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      isActive: true,
    }
  });

  const openModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      reset({
        nameEn: brand.nameEn,
        nameAr: brand.nameAr,
        slug: brand.slug,
        descriptionEn: brand.descriptionEn || '',
        descriptionAr: brand.descriptionAr || '',
        isActive: brand.isActive,
        logo: brand.logo || '',
      });
    } else {
      setEditingBrand(null);
      reset({ nameEn: '', nameAr: '', slug: '', descriptionEn: '', descriptionAr: '', isActive: true, logo: '' });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: BrandInput) => {
    try {
      if (editingBrand) {
        await updateBrand(editingBrand.id, data);
        showToast('تم تحديث الماركة بنجاح', 'success');
      } else {
        await createBrand(data);
        showToast('تم إنشاء الماركة بنجاح', 'success');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      showToast(error.message || 'حدث خطأ ما', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الماركة؟')) {
      try {
        await deleteBrand(id);
        showToast('تم حذف الماركة بنجاح', 'success');
      } catch (error: any) {
        showToast('فشل حذف الماركة', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">الماركات</h1>
        <Button onClick={() => openModal()}>
          <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
          إضافة ماركة
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>الاسم</TableHead>
            <TableHead>الرابط</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-right rtl:text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                لا توجد ماركات.
              </TableCell>
            </TableRow>
          ) : (
            brands.map((brand, index) => (
              <TableRow key={brand.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{brand.nameAr}</TableCell>
                <TableCell>{brand.slug}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${brand.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {brand.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </TableCell>
                <TableCell className="text-right rtl:text-left">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openModal(brand)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(brand.id)}>
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
        title={editingBrand ? 'تعديل الماركة' : 'ماركة جديدة'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ImageUpload 
            label="لوجو الماركة (اختياري)" 
            value={watch('logo') || ''} 
            onChange={(url) => setValue('logo', url, { shouldValidate: true })} 
            folder="brands"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="الاسم بالعربية" {...register('nameAr')} error={errors.nameAr?.message} />
            <Input label="الاسم بالإنجليزية" {...register('nameEn')} error={errors.nameEn?.message} />
          </div>
          <Input label="الرابط (Slug)" {...register('slug')} error={errors.slug?.message} />
          <Input label="الوصف بالعربية" {...register('descriptionAr')} error={errors.descriptionAr?.message} />
          <Input label="الوصف بالإنجليزية" {...register('descriptionEn')} error={errors.descriptionEn?.message} />
          
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isActive" {...register('isActive')} className="h-4 w-4 rounded border-gray-300" />
            <label htmlFor="isActive" className="text-sm font-medium">نشط</label>
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
