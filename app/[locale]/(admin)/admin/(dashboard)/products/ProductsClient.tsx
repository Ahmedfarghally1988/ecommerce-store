"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category, Brand } from '@prisma/client';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/shared/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/Table';
import { useToast } from '@/components/shared/ui/Toast';
import { deleteProduct, toggleProductStatus } from '@/app/actions/admin/products';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';

type ProductWithRelations = Product & {
  category: Category | null;
  brand: Brand | null;
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
  activeLabel = "نشط",
  inactiveLabel = "معطل",
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

export function ProductsClient({ products }: { products: ProductWithRelations[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { currency } = useCart();

  const [productsList, setProductsList] = useState<ProductWithRelations[]>(products);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [, startTransition] = useTransition();

  const handleToggle = async (productId: string, currentVal: boolean) => {
    const newVal = !currentVal;
    
    setProductsList(prev =>
      prev.map(p => (p.id === productId ? { ...p, isActive: newVal } : p))
    );
    setLoadingIds(prev => ({ ...prev, [productId]: true }));

    try {
      await toggleProductStatus(productId, newVal);
      showToast('تم تحديث الحالة بنجاح', 'success');
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      setProductsList(prev =>
        prev.map(p => (p.id === productId ? { ...p, isActive: currentVal } : p))
      );
      showToast('فشل تحديث الحالة', 'error');
    } finally {
      setLoadingIds(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await deleteProduct(id);
        showToast('تم حذف المنتج بنجاح', 'success');
      } catch (error: any) {
        showToast('فشل حذف المنتج', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">المنتجات</h1>
        <Button onClick={() => router.push('/ar/admin/products/new')}>
          <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
          إضافة منتج
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>المنتج</TableHead>
            <TableHead>رمز الـ SKU</TableHead>
            <TableHead>السعر</TableHead>
            <TableHead>المخزون</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-right rtl:text-left">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productsList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                لا توجد منتجات. ابدأ بإضافة منتج جديد.
              </TableCell>
            </TableRow>
          ) : (
            productsList.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{product.nameAr}</span>
                    <span className="text-xs text-gray-500">
                      {product.category?.nameAr || 'غير مصنف'} • {product.brand?.nameAr || 'بدون ماركة'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{formatPrice(Number(product.price), currency)}</TableCell>
                <TableCell>
                  <span className={`${product.stock <= product.lowStockThreshold ? 'text-red-600 font-bold' : ''}`}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <ToggleSwitch
                    checked={product.isActive}
                    disabled={loadingIds[product.id]}
                    onChange={() => handleToggle(product.id, product.isActive)}
                    label={`الحالة: ${product.nameAr}`}
                  />
                </TableCell>
                <TableCell className="text-right rtl:text-left">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/ar/admin/products/${product.id}/edit`)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
