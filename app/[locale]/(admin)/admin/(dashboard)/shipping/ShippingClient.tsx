"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/shared/ui/Toast';
import { shippingSchema, ShippingInput } from '@/lib/validations/admin';
import { updateShippingSettings } from '@/app/actions/admin/shipping';
import { Truck, Save, CheckCircle, Plus, Trash2 } from 'lucide-react';

export function ShippingClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const { showToast } = useToast();
  const [saved, setSaved] = useState(false);

  let initialShippingRegions = [];
  try {
    if (initialSettings.shipping_regions) {
      initialShippingRegions = JSON.parse(initialSettings.shipping_regions);
    }
  } catch (e) {}

  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ShippingInput>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      shipping_base_cost: initialSettings.shipping_base_cost || '',
      shipping_free_threshold: initialSettings.shipping_free_threshold || '',
      shipping_regions: initialShippingRegions,
    }
  });

  const { fields: shippingFields, append: appendShipping, remove: removeShipping } = useFieldArray({
    control,
    name: "shipping_regions"
  });

  const onSubmit = async (data: ShippingInput) => {
    try {
      await updateShippingSettings(data);
      setSaved(true);
      showToast('تم حفظ إعدادات الشحن بنجاح', 'success');
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      showToast(error.message || 'فشل تحديث إعدادات الشحن', 'error');
    }
  };

  const inputCls = "w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white";

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Truck className="w-8 h-8 text-blue-600" />
            الشحن والتوصيل
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            إدارة تكاليف الشحن، الشحن المجاني، والتسعيرة المخصصة للمحافظات.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="تكلفة الشحن الأساسية" hint="التكلفة الافتراضية إذا لم يتم تحديد تكلفة للمحافظة" error={errors.shipping_base_cost?.message}>
              <input type="number" step="0.01" {...register('shipping_base_cost')} className={inputCls} placeholder="0" />
            </Field>
            <Field label="الحد الأدنى للشحن المجاني" hint="اترك الحقل فارغاً لإلغاء الشحن المجاني" error={errors.shipping_free_threshold?.message}>
              <input type="number" step="0.01" {...register('shipping_free_threshold')} className={inputCls} placeholder="مثال: 1000" />
            </Field>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">مناطق شحن مخصصة</h3>
              <button 
                type="button" 
                onClick={() => appendShipping({ id: Date.now().toString(), name: '', cost: '0' })}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                إضافة منطقة
              </button>
            </div>
            
            <div className="space-y-3">
              {shippingFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">المنطقة / المحافظة</label>
                    <input 
                      {...register(`shipping_regions.${index}.name` as const)}
                      className={inputCls} 
                      placeholder="مثال: القاهرة" 
                    />
                    {errors.shipping_regions?.[index]?.name && <p className="text-red-500 text-xs mt-1">{errors.shipping_regions[index]?.name?.message}</p>}
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">تكلفة الشحن</label>
                    <input 
                      type="number" step="0.01"
                      {...register(`shipping_regions.${index}.cost` as const)}
                      className={inputCls} 
                      placeholder="مثال: 50" 
                    />
                    {errors.shipping_regions?.[index]?.cost && <p className="text-red-500 text-xs mt-1">{errors.shipping_regions[index]?.cost?.message}</p>}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeShipping(index)}
                    className="mt-6 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {shippingFields.length === 0 && (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">لا توجد مناطق شحن مخصصة. سيتم تطبيق تكلفة الشحن الأساسية على جميع الطلبات.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
            }`}
          >
            {saved ? (
              <><CheckCircle className="w-4 h-4" /> تم الحفظ</>
            ) : isSubmitting ? (
              <><span className="animate-spin">⟳</span> جاري الحفظ...</>
            ) : (
              <><Save className="w-4 h-4" /> حفظ الإعدادات</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children, error, hint }: { label: string; children: React.ReactNode; error?: string; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
