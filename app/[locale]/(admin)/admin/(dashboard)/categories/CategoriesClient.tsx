"use client";

import { useState, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Category } from '@prisma/client';
import { Plus, Edit2, Trash2, Folder, Layers, Search } from 'lucide-react';
import { Button } from '@/components/shared/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/Table';
import { useToast } from '@/components/shared/ui/Toast';
import { deleteCategory, toggleCategoryStatus } from '@/app/actions/admin/categories';
import Image from 'next/image';

type CategoryWithParent = Category & {
  parent?: Category | null;
};

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  activeLabel?: string;
  inactiveLabel?: string;
}

function ToggleSwitch({
  checked,
  onChange,
  disabled,
  label,
  activeLabel = "ظاهر",
  inactiveLabel = "مخفي",
}: ToggleSwitchProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        title={label}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? 'bg-black dark:bg-emerald-600 justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
        }`}
      >
        <span className="sr-only">{label}</span>
        <span className="h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200" />
      </button>
      <span className={`text-xs font-medium ${checked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>
        {checked ? activeLabel : inactiveLabel}
      </span>
    </div>
  );
}

export function CategoriesClient({ categories: initialCategories }: { categories: CategoryWithParent[] }) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const { showToast } = useToast();
  
  const [categoriesList, setCategoriesList] = useState<CategoryWithParent[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [, startTransition] = useTransition();

  const filteredCategories = categoriesList.filter(cat => {
    const q = searchQuery.toLowerCase();
    return cat.nameAr.toLowerCase().includes(q) || (cat.nameEn && cat.nameEn.toLowerCase().includes(q));
  });

  const handleToggle = async (
    categoryId: string,
    field: 'isActive' | 'showInHeader' | 'showInFooter',
    currentVal: boolean
  ) => {
    const newVal = !currentVal;
    
    // Optimistic UI update
    setCategoriesList(prev =>
      prev.map(c => (c.id === categoryId ? { ...c, [field]: newVal } : c))
    );
    setLoadingIds(prev => ({ ...prev, [`${categoryId}-${field}`]: true }));

    try {
      await toggleCategoryStatus(categoryId, field, newVal);
      showToast('تم تحديث حالة العرض بنجاح', 'success');
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      // Revert state on failure
      setCategoriesList(prev =>
        prev.map(c => (c.id === categoryId ? { ...c, [field]: currentVal } : c))
      );
      showToast(error.message || 'فشل تحديث الحالة', 'error');
    } finally {
      setLoadingIds(prev => ({ ...prev, [`${categoryId}-${field}`]: false }));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف القسم "${name}"؟`)) {
      try {
        await deleteCategory(id);
        setCategoriesList(prev => prev.filter(c => c.id !== id));
        showToast('تم حذف القسم بنجاح', 'success');
        startTransition(() => {
          router.refresh();
        });
      } catch (error: any) {
        showToast(error.message || 'فشل حذف القسم', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">الأقسام والتصنيفات</h1>
          <p className="text-sm text-gray-500 mt-1">
            إدارة أقسام المتجر، وتخصيص ظهورها في القائمة العلوية والفوتر ومحركات البحث.
          </p>
        </div>
        <Button onClick={() => router.push(`/${locale}/admin/categories/new`)}>
          <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
          إضافة قسم جديد
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
          <input
            type="text"
            placeholder="البحث في الأقسام..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 px-10 border border-gray-300 rounded-md bg-white text-sm dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:text-gray-100"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>القسم</TableHead>
            <TableHead>القسم الأب</TableHead>
            <TableHead>الظهور في الهيدر</TableHead>
            <TableHead>الظهور في الفوتر</TableHead>
            <TableHead>حالة النشاط</TableHead>
            <TableHead className="text-right rtl:text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-10">
                {searchQuery ? 'لا توجد نتائج تطابق بحثك' : 'لا توجد أقسام مسجلة حالياً. انقر على "إضافة قسم جديد" للبدء.'}
              </TableCell>
            </TableRow>
          ) : (
            filteredCategories.map((cat, index) => {
              const inHeader = (cat as any).showInHeader ?? true;
              const inFooter = (cat as any).showInFooter ?? true;
              const isActive = cat.isActive ?? true;

              return (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  {/* Category Image & Name */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800 flex items-center justify-center">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.nameAr}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <Folder className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{cat.nameAr}</span>
                        <span className="text-xs text-gray-500 font-mono">/{cat.slug}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Parent Category */}
                  <TableCell>
                    {cat.parent ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        <Layers className="h-3 w-3" />
                        {cat.parent.nameAr}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">رئيسي</span>
                    )}
                  </TableCell>

                  {/* Show in Header Switch */}
                  <TableCell>
                    <ToggleSwitch
                      checked={inHeader}
                      disabled={loadingIds[`${cat.id}-showInHeader`]}
                      onChange={() => handleToggle(cat.id, 'showInHeader', inHeader)}
                      label={`الظهور في الهيدر: ${cat.nameAr}`}
                    />
                  </TableCell>

                  {/* Show in Footer Switch */}
                  <TableCell>
                    <ToggleSwitch
                      checked={inFooter}
                      disabled={loadingIds[`${cat.id}-showInFooter`]}
                      onChange={() => handleToggle(cat.id, 'showInFooter', inFooter)}
                      label={`الظهور في الفوتر: ${cat.nameAr}`}
                    />
                  </TableCell>

                  {/* Active Switch */}
                  <TableCell>
                    <ToggleSwitch
                      checked={isActive}
                      disabled={loadingIds[`${cat.id}-isActive`]}
                      onChange={() => handleToggle(cat.id, 'isActive', isActive)}
                      activeLabel="نشط"
                      inactiveLabel="معطل"
                      label={`الحالة: ${cat.nameAr}`}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right rtl:text-left">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="تعديل القسم"
                        onClick={() => router.push(`/${locale}/admin/categories/${cat.id}/edit`)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="حذف القسم"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={() => handleDelete(cat.id, cat.nameAr)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
