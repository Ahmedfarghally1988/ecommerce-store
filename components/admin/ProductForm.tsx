"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Product, Category, Brand, ProductImage, ProductVariant } from '@prisma/client';
import { Button } from '@/components/shared/ui/Button';
import { Input } from '@/components/shared/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/Card';
import { useToast } from '@/components/shared/ui/Toast';
import { productSchema, ProductInput } from '@/lib/validations/admin';
import { createProduct, updateProduct } from '@/app/actions/admin/products';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Plus, Trash2 } from 'lucide-react';

interface ProductFormProps {
  initialData?: Product & { images?: ProductImage[], variants?: ProductVariant[] };
  categories: Category[];
  brands: Brand[];
}

function FormToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 dark:border-gray-800">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => onChange(!checked)}>{label}</label>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
          checked ? 'bg-black dark:bg-emerald-600 justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
        }`}
      >
        <span className="sr-only">{label}</span>
        <span className="h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200" />
      </button>
    </div>
  );
}

export function ProductForm({ initialData, categories, brands }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const { register, control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: Number(initialData.price),
      compareAtPrice: initialData.compareAtPrice ? Number(initialData.compareAtPrice) : null,
      costPrice: initialData.costPrice ? Number(initialData.costPrice) : null,
      weight: initialData.weight ? Number(initialData.weight) : null,
      metaTitle: initialData.metaTitle || '',
      metaDescription: initialData.metaDescription || '',
      canonicalUrl: (initialData as any).canonicalUrl || '',
      customSchema: (initialData as any).customSchema || '',
      images: initialData.images?.map(img => img.url) || [],
      variants: initialData.variants?.map(v => ({
        id: v.id,
        nameEn: v.nameEn,
        nameAr: v.nameAr,
        sku: v.sku,
        price: Number(v.price),
        stock: v.stock,
        attributes: v.attributes && typeof v.attributes === 'object' ? v.attributes as Record<string, string> : undefined,
      })) || [],
    } : {
      isActive: true,
      isFeatured: false,
      isLatest: false,
      isSpecialOffer: false,
      showRelatedProducts: true,
      stock: 0,
      lowStockThreshold: 5,
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      customSchema: '',
      images: [],
      variants: [],
    }
  });

  const [optionGroups, setOptionGroups] = useState<{ id: string; name: string; values: string }[]>(() => {
    if (initialData?.variants && initialData.variants.length > 0) {
      const groupsMap: Record<string, Set<string>> = {};
      initialData.variants.forEach(v => {
        if (v.attributes && typeof v.attributes === 'object') {
          Object.entries(v.attributes).forEach(([k, val]) => {
            if (!groupsMap[k]) groupsMap[k] = new Set();
            groupsMap[k].add(String(val));
          });
        }
      });
      const parsed = Object.entries(groupsMap).map(([name, set]) => ({
        id: Math.random().toString(),
        name,
        values: Array.from(set).join('، ')
      }));
      if (parsed.length > 0) return parsed;
    }
    return [
      { id: '1', name: 'المقاسات', values: '' },
      { id: '2', name: 'الألوان', values: '' }
    ];
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants"
  });

  const generateVariants = () => {
    const validGroups = optionGroups.filter(g => g.name.trim() !== '' && g.values.trim() !== '');
    if (validGroups.length === 0) return;

    const parsedGroups = validGroups.map(g => ({
      name: g.name.trim(),
      values: g.values.split(/[،,]/).map(v => v.trim()).filter(Boolean)
    }));

    const combine = (acc: Record<string, string>[], groupIndex: number): Record<string, string>[] => {
      if (groupIndex === parsedGroups.length) return acc;
      const group = parsedGroups[groupIndex];
      if (acc.length === 0) {
        return combine(group.values.map(v => ({ [group.name]: v })), groupIndex + 1);
      }
      const nextAcc: Record<string, string>[] = [];
      acc.forEach(existing => {
        group.values.forEach(v => {
          nextAcc.push({ ...existing, [group.name]: v });
        });
      });
      return combine(nextAcc, groupIndex + 1);
    };

    const combinations = combine([], 0);
    const currentVariants = watch('variants') || [];
    
    const newVariants = combinations.map(comb => {
      const name = Object.values(comb).join(' - ');
      const existing = currentVariants.find(v => {
        if (!v.attributes) return false;
        const keys1 = Object.keys(comb);
        const keys2 = Object.keys(v.attributes);
        if (keys1.length !== keys2.length) return false;
        return keys1.every(k => comb[k] === v.attributes![k]);
      });

      if (existing) return existing;

      return {
        nameEn: name,
        nameAr: name,
        sku: '',
        price: Number(watch('price') || 0),
        stock: 0,
        attributes: comb,
      };
    });

    setValue('variants', newVariants, { shouldValidate: true });
    showToast('تم توليد الخيارات بنجاح', 'success');
  };

  const departments = categories.filter(c => !c.parentId);
  const [selectedDeptId, setSelectedDeptId] = useState<string>(() => {
    if (initialData?.categoryId) {
      const cat = categories.find(c => c.id === initialData?.categoryId);
      if (cat?.parentId) return cat.parentId;
      return cat?.id || '';
    }
    return '';
  });

  const subCategories = categories.filter(c => c.parentId === selectedDeptId);

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = e.target.value;
    setSelectedDeptId(deptId);
    setValue('categoryId', deptId, { shouldValidate: true });
  };

  const handleSubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subId = e.target.value;
    if (subId) {
      setValue('categoryId', subId, { shouldValidate: true });
    } else {
      setValue('categoryId', selectedDeptId, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ProductInput) => {
    try {
      if (initialData) {
        await updateProduct(initialData.id, data);
        showToast('تم تحديث المنتج بنجاح', 'success');
      } else {
        await createProduct(data);
        showToast('تم إضافة المنتج بنجاح', 'success');
      }
      router.push('/en/admin/products');
      router.refresh();
    } catch (error: any) {
      showToast(error.message || 'فشل حفظ المنتج', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {initialData ? 'تعديل المنتج' : 'إضافة منتج'}
        </h1>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.push('/en/admin/products')}>إلغاء</Button>
          <Button type="submit" isLoading={isSubmitting}>حفظ المنتج</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>المعلومات الأساسية</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="الاسم بالعربية" {...register('nameAr')} error={errors.nameAr?.message} />
                <Input label="الاسم بالإنجليزية" {...register('nameEn')} error={errors.nameEn?.message} />
              </div>
              <Input label="الرابط (Slug)" {...register('slug')} error={errors.slug?.message} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="وصف قصير بالعربية" {...register('shortDescriptionAr')} error={errors.shortDescriptionAr?.message} />
                <Input label="وصف قصير بالإنجليزية" {...register('shortDescriptionEn')} error={errors.shortDescriptionEn?.message} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">الوصف التفصيلي بالعربية</label>
                <textarea 
                  {...register('descriptionAr')}
                  className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:text-gray-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">الوصف التفصيلي بالإنجليزية</label>
                <textarea 
                  {...register('descriptionEn')}
                  className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:text-gray-50"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>الأسعار</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Input label="السعر الأساسي" type="number" step="0.01" {...register('price')} error={errors.price?.message} />
              <Input label="السعر قبل الخصم" type="number" step="0.01" {...register('compareAtPrice')} error={errors.compareAtPrice?.message} />
              <Input label="سعر التكلفة" type="number" step="0.01" {...register('costPrice')} error={errors.costPrice?.message} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>المخزون</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Input label="رمز المنتج (SKU)" {...register('sku')} error={errors.sku?.message} />
              <Input label="الكمية المتوفرة" type="number" {...register('stock')} error={errors.stock?.message} />
              <Input label="حد المخزون المنخفض" type="number" {...register('lowStockThreshold')} error={errors.lowStockThreshold?.message} />
              <Input label="الوزن (كجم)" type="number" step="0.01" {...register('weight')} error={errors.weight?.message} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>مجموعات الخيارات (توليد تلقائي للأنواع والألوان)</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={() => setOptionGroups([...optionGroups, { id: Math.random().toString(), name: '', values: '' }])}>
                <Plus className="w-4 h-4 rtl:ml-2 ltr:mr-2" /> إضافة مجموعة
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">أدخل اسم الخيار (مثل: المقاسات، الألوان) والقيم المتاحة مفصولة بفاصلة، ثم اضغط على زر التوليد لإنشاء جدول الخيارات بالأسفل تلقائياً.</p>
              {optionGroups.map((group, idx) => (
                <div key={group.id} className="flex gap-3 items-start">
                  <div className="w-1/3">
                    <label className="block text-xs text-gray-500 mb-1">اسم المجموعة</label>
                    <Input placeholder="مثال: المقاسات" value={group.name} onChange={e => {
                      const newGroups = [...optionGroups];
                      newGroups[idx].name = e.target.value;
                      setOptionGroups(newGroups);
                    }} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">القيم (مفصولة بفاصلة)</label>
                    <Input placeholder="مثال: S, M, L" value={group.values} onChange={e => {
                      const newGroups = [...optionGroups];
                      newGroups[idx].values = e.target.value;
                      setOptionGroups(newGroups);
                    }} />
                  </div>
                  <button type="button" onClick={() => setOptionGroups(optionGroups.filter(g => g.id !== group.id))} className="h-10 px-3 mt-5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <Button type="button" onClick={generateVariants} className="w-full mt-2" variant="secondary">
                توليد الخيارات بالأسفل ↓
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>الخيارات (الأنواع / المقاسات / الألوان)</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={() => appendVariant({ nameEn: '', nameAr: '', sku: '', price: 0, stock: 0 })}>
                <Plus className="w-4 h-4 rtl:ml-2 ltr:mr-2" /> إضافة خيار
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {variantFields.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">لا توجد خيارات مضافة. المنتج سيعتمد السعر والمخزون الأساسي.</p>
              ) : (
                <div className="space-y-4">
                  {variantFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900/50 relative group">
                      <div className="md:col-span-2 grid grid-cols-2 gap-2">
                        <Input label="خيار (AR)" {...register(`variants.${index}.nameAr` as const)} error={errors.variants?.[index]?.nameAr?.message} />
                        <Input label="خيار (EN)" {...register(`variants.${index}.nameEn` as const)} error={errors.variants?.[index]?.nameEn?.message} />
                      </div>
                      <div>
                        <Input label="رمز SKU" {...register(`variants.${index}.sku` as const)} error={errors.variants?.[index]?.sku?.message} />
                      </div>
                      <div>
                        <Input label="السعر" type="number" step="0.01" {...register(`variants.${index}.price` as const)} error={errors.variants?.[index]?.price?.message} />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Input label="الكمية" type="number" {...register(`variants.${index}.stock` as const)} error={errors.variants?.[index]?.stock?.message} />
                        </div>
                        <button type="button" onClick={() => removeVariant(index)} className="h-10 px-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>الصور والوسائط (Images)</CardTitle></CardHeader>
            <CardContent>
              <ImageUpload 
                label="معرض الصور (أول صورة ستكون الرئيسية)" 
                multiple={true} 
                value={watch('images') || []} 
                onChange={(urls) => setValue('images', urls, { shouldValidate: true })} 
                folder="products"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>التصنيف والماركة</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">القسم الرئيسي</label>
                  <select 
                    value={selectedDeptId}
                    onChange={handleDeptChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:text-gray-50"
                  >
                    <option value="">اختر القسم الرئيسي</option>
                    {departments.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                  </select>
                </div>

                {selectedDeptId && subCategories.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">الفئة الفرعية</label>
                    <select 
                      value={watch('categoryId') === selectedDeptId ? '' : (watch('categoryId') || '')}
                      onChange={handleSubChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:text-gray-50"
                    >
                      <option value="">اختر الفئة الفرعية (اختياري)</option>
                      {subCategories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                    </select>
                  </div>
                )}
                <input type="hidden" {...register('categoryId')} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">الماركة</label>
                <select 
                  {...register('brandId')}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:text-gray-50"
                >
                  <option value="">اختر الماركة</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.nameAr}</option>)}
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
                <FormToggleSwitch
                  checked={watch('isActive') || false}
                  onChange={(val) => setValue('isActive', val, { shouldValidate: true })}
                  label="نشط (مرئي للعملاء)"
                />
                
                <FormToggleSwitch
                  checked={watch('isFeatured') || false}
                  onChange={(val) => setValue('isFeatured', val, { shouldValidate: true })}
                  label="عرض في المنتجات المميزة"
                />

                <FormToggleSwitch
                  checked={watch('isLatest') || false}
                  onChange={(val) => setValue('isLatest', val, { shouldValidate: true })}
                  label="عرض في أحدث المنتجات"
                />

                <FormToggleSwitch
                  checked={watch('isSpecialOffer') || false}
                  onChange={(val) => setValue('isSpecialOffer', val, { shouldValidate: true })}
                  label="إضافة في عروض خاصة"
                />

                <FormToggleSwitch
                  checked={watch('showRelatedProducts') || false}
                  onChange={(val) => setValue('showRelatedProducts', val, { shouldValidate: true })}
                  label="إظهار منتجات ذات صلة في صفحة المنتج"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>تحسين محركات البحث (SEO)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input label="عنوان الميتا (Meta Title)" {...register('metaTitle')} />
              <div className="space-y-2">
                <label className="text-sm font-medium">وصف الميتا (Meta Description)</label>
                <textarea 
                  {...register('metaDescription')}
                  className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:text-gray-50"
                />
              </div>
              <Input 
                label="الرابط الأساسي (Canonical URL)" 
                placeholder="https://example.com/products/slug"
                {...register('canonicalUrl')} 
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">كود الإسكيما (Custom JSON-LD Schema)</label>
                <textarea 
                  {...register('customSchema')}
                  rows={5}
                  dir="ltr"
                  placeholder='{"@context": "https://schema.org", "@type": "Product", ...}'
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
