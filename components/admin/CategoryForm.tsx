"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { Category } from '@prisma/client';
import { Button } from '@/components/shared/ui/Button';
import { Input } from '@/components/shared/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/Card';
import { useToast } from '@/components/shared/ui/Toast';
import { categorySchema, CategoryInput } from '@/lib/validations/admin';
import { createCategory, updateCategory } from '@/app/actions/admin/categories';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface CategoryFormProps {
  initialData?: Category | null;
  categories: Category[];
}

function SwitchToggle({
  checked,
  onChange,
  id,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  id?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked
            ? 'ltr:translate-x-5 rtl:-translate-x-5'
            : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function CategoryForm({ initialData, categories }: CategoryFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const { showToast } = useToast();

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData ? {
      nameEn: initialData.nameEn,
      nameAr: initialData.nameAr,
      slug: initialData.slug,
      descriptionEn: initialData.descriptionEn || '',
      descriptionAr: initialData.descriptionAr || '',
      parentId: initialData.parentId || '',
      image: initialData.image || '',
      isActive: initialData.isActive,
      showInHeader: (initialData as any).showInHeader ?? true,
      showInFooter: (initialData as any).showInFooter ?? true,
      sortOrder: initialData.sortOrder ?? 0,
      metaTitle: (initialData as any).metaTitle || '',
      metaDescription: (initialData as any).metaDescription || '',
      canonicalUrl: (initialData as any).canonicalUrl || '',
      customSchema: (initialData as any).customSchema || '',
    } : {
      nameEn: '',
      nameAr: '',
      slug: '',
      descriptionEn: '',
      descriptionAr: '',
      parentId: '',
      image: '',
      isActive: true,
      showInHeader: true,
      showInFooter: true,
      sortOrder: 0,
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      customSchema: '',
    }
  });

  const isActive = watch('isActive');
  const showInHeader = watch('showInHeader');
  const showInFooter = watch('showInFooter');

  useEffect(() => {
    register('isActive');
    register('showInHeader');
    register('showInFooter');
  }, [register]);

  const onSubmit = async (data: CategoryInput) => {
    try {
      if (initialData) {
        await updateCategory(initialData.id, data);
        showToast('تم تحديث القسم بنجاح', 'success');
      } else {
        await createCategory(data);
        showToast('تم إضافة القسم بنجاح', 'success');
      }
      router.push(`/${locale}/admin/categories`);
      router.refresh();
    } catch (error: any) {
      showToast(error.message || 'فشل حفظ القسم', 'error');
    }
  };

  // Filter out current category from parent list to prevent circular parent selection
  const availableParents = categories.filter(c => !initialData || c.id !== initialData.id);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {initialData ? 'تعديل القسم' : 'إضافة قسم جديد'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {initialData ? `تعديل بيانات القسم: ${initialData.nameAr}` : 'إدخال تفاصيل القسم وإعدادات العرض والـ SEO'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/${locale}/admin/categories`)}
          >
            إلغاء
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? 'تحديث القسم' : 'حفظ القسم'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="الاسم بالعربية" placeholder="مثال: عطور" {...register('nameAr')} error={errors.nameAr?.message} />
                <Input label="الاسم بالإنجليزية" placeholder="e.g: Perfumes" {...register('nameEn')} error={errors.nameEn?.message} />
              </div>
              <Input 
                label="الرابط الدائم (Slug)" 
                placeholder="مثال: men-perfumes"
                {...register('slug')} 
                error={errors.slug?.message} 
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">الوصف بالعربية</label>
                <textarea 
                  {...register('descriptionAr')}
                  rows={3}
                  className="flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:text-gray-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">الوصف بالإنجليزية</label>
                <textarea 
                  {...register('descriptionEn')}
                  rows={3}
                  className="flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:text-gray-50"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>صورة القسم</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload 
                label="صورة الغلاف أو الأيقونة الخاصة بالقسم" 
                value={watch('image') || ''} 
                onChange={(url) => setValue('image', url as string, { shouldValidate: true })} 
                folder="categories"
              />
            </CardContent>
          </Card>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>التنظيم والعرض</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">القسم الرئيسي (Department)</label>
                <select 
                  {...register('parentId')}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:text-gray-50"
                >
                  <option value="">بدون قسم (سيعتبر هذا قسماً رئيسياً)</option>
                  {availableParents.map(c => (
                    <option key={c.id} value={c.id}>{c.nameAr}</option>
                  ))}
                </select>
              </div>

              <Input 
                label="ترتيب العرض" 
                type="number" 
                placeholder="0"
                {...register('sortOrder')} 
                error={errors.sortOrder?.message} 
              />

              <div className="pt-2 space-y-3">
                {/* 1. قسم نشط */}
                <div
                  onClick={() => setValue('isActive', !isActive, { shouldValidate: true, shouldDirty: true })}
                  className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    isActive
                      ? 'bg-blue-50/50 dark:bg-blue-950/20 border-b border-gray-200lue-200 dark:border-b border-gray-200lue-900/50'
                      : 'bg-gray-50/60 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex-1 pe-3">
                    <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer block">
                      قسم نشط (متاح للعملاء)
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      تفعيل ظهور القسم وتصفح منتجاته للمتسوقين
                    </p>
                  </div>
                  <SwitchToggle
                    checked={!!isActive}
                    onChange={() => setValue('isActive', !isActive, { shouldValidate: true, shouldDirty: true })}
                  />
                </div>

                {/* 2. الظهور في القائمة الرئيسية (الهيدر) */}
                <div
                  onClick={() => setValue('showInHeader', !showInHeader, { shouldValidate: true, shouldDirty: true })}
                  className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    showInHeader
                      ? 'bg-blue-50/50 dark:bg-blue-950/20 border-b border-gray-200lue-200 dark:border-b border-gray-200lue-900/50'
                      : 'bg-gray-50/60 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex-1 pe-3">
                    <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer block">
                      الظهور في القائمة الرئيسية (الهيدر)
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      عرض رابط القسم في شريط التصفح العلوي
                    </p>
                  </div>
                  <SwitchToggle
                    checked={!!showInHeader}
                    onChange={() => setValue('showInHeader', !showInHeader, { shouldValidate: true, shouldDirty: true })}
                  />
                </div>

                {/* 3. الظهور في قائمة الفوتر */}
                <div
                  onClick={() => setValue('showInFooter', !showInFooter, { shouldValidate: true, shouldDirty: true })}
                  className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    showInFooter
                      ? 'bg-blue-50/50 dark:bg-blue-950/20 border-b border-gray-200lue-200 dark:border-b border-gray-200lue-900/50'
                      : 'bg-gray-50/60 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex-1 pe-3">
                    <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer block">
                      الظهور في قائمة الفوتر
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      عرض رابط القسم ضمن روابط الفوتر أسفل الموقع
                    </p>
                  </div>
                  <SwitchToggle
                    checked={!!showInFooter}
                    onChange={() => setValue('showInFooter', !showInFooter, { shouldValidate: true, shouldDirty: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تحسين محركات البحث (SEO)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                label="عنوان الميتا (Meta Title)" 
                placeholder="عنوان مخصص للظهور في نتائج البحث"
                {...register('metaTitle')} 
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">وصف الميتا (Meta Description)</label>
                <textarea 
                  {...register('metaDescription')}
                  rows={3}
                  placeholder="وصف ملائم وموجز لمحركات البحث ومواقع التواصل..."
                  className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:text-gray-50"
                />
              </div>
              <Input 
                label="الرابط الأساسي (Canonical URL)" 
                placeholder="https://example.com/category/slug"
                {...register('canonicalUrl')} 
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">كود الإسكيما (Custom JSON-LD Schema)</label>
                <textarea 
                  {...register('customSchema')}
                  rows={5}
                  dir="ltr"
                  placeholder='{"@context": "https://schema.org", "@type": "CollectionPage", ...}'
                  className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:text-gray-50"
                />
                <p className="text-xs text-gray-500">
                  إذا تركته فارغاً، سيقوم النظام بتوليد الكود تلقائياً. تأكد من إدخال كود JSON صحيح لتجنب أي أخطاء.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
