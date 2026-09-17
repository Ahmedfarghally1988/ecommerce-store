"use client";

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/shared/ui/Toast';
import { settingsSchema, SettingsInput } from '@/lib/validations/admin';
import { updateSettings } from '@/app/actions/admin/settings';
import { Store, Phone, Share2, Globe, Image, Save, CheckCircle, Upload, Plus, Trash2, FileText } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const tabs = [
  { id: 'general', label: 'المعلومات الأساسية', icon: Store },
  { id: 'contact', label: 'التواصل والعنوان', icon: Phone },
  { id: 'social', label: 'وسائل التواصل', icon: Share2 },
  { id: 'appearance', label: 'المظهر والواجهة', icon: Image },
  { id: 'policies', label: 'السياسات والشروط', icon: FileText },
];

export function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  let initialCustomSocials = [];
  try {
    if (initialSettings.custom_social_links) {
      initialCustomSocials = JSON.parse(initialSettings.custom_social_links);
    }
  } catch (e) {}

  const { register, control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      store_name: initialSettings.store_name || '',
      contact_email: initialSettings.contact_email || '',
      contact_phone: initialSettings.contact_phone || '',
      whatsapp: initialSettings.whatsapp || '',
      address: initialSettings.address || '',
      store_location_map: initialSettings.store_location_map || '',
      logo: initialSettings.logo || '',
      footer_logo: initialSettings.footer_logo || '',
      favicon: initialSettings.favicon || '',
      header_tagline_ar: initialSettings.header_tagline_ar || '',
      header_tagline_en: initialSettings.header_tagline_en || '',
      index_title_ar: initialSettings.index_title_ar || '',
      index_title_en: initialSettings.index_title_en || '',
      index_description_ar: initialSettings.index_description_ar || '',
      index_description_en: initialSettings.index_description_en || '',
      custom_social_links: initialCustomSocials,
      privacy_policy_title_ar: initialSettings.privacy_policy_title_ar || '',
      privacy_policy_title_en: initialSettings.privacy_policy_title_en || '',
      privacy_policy_ar: initialSettings.privacy_policy_ar || '',
      privacy_policy_en: initialSettings.privacy_policy_en || '',
      terms_of_use_title_ar: initialSettings.terms_of_use_title_ar || '',
      terms_of_use_title_en: initialSettings.terms_of_use_title_en || '',
      terms_of_use_ar: initialSettings.terms_of_use_ar || '',
      terms_of_use_en: initialSettings.terms_of_use_en || '',
    }
  });

  const currentLogo = watch('logo');
  const currentFooterLogo = watch('footer_logo');
  const currentFavicon = watch('favicon');

  const { fields, append, remove } = useFieldArray({
    control,
    name: "custom_social_links"
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logo' | 'footer_logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'media');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setValue(fieldName, data.url, { shouldValidate: true });
      showToast('تم رفع الصورة بنجاح', 'success');
    } catch (error: any) {
      showToast(error.message || 'فشل رفع الصورة', 'error');
    } finally {
      setUploadingField(null);
    }
  };

  const onSubmit = async (data: SettingsInput) => {
    try {
      await updateSettings(data);
      setSaved(true);
      showToast('تم حفظ الإعدادات بنجاح', 'success');
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      showToast(error.message || 'فشل تحديث الإعدادات', 'error');
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">الإعدادات</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">إدارة بيانات المتجر وبيانات التواصل</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium flex-1 justify-center transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
          {/* General Tab */}
          {activeTab === 'general' && (
            <>
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-600" /> المعلومات الأساسية
              </h2>
              <Field label="اسم المتجر *" error={errors.store_name?.message}>
                <input {...register('store_name')} className={inputCls} placeholder="مثال: متجر الإلكترونيات" />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="شعار المتجر (بالعربية) *" hint="جملة تسويقية تظهر في الهيدر الأعلى" error={errors.header_tagline_ar?.message}>
                  <input {...register('header_tagline_ar')} className={inputCls} placeholder="شحن سريع | أفضل الأسعار | ضمان الجودة" />
                </Field>
                <Field label="شعار المتجر (بالإنجليزية) *" hint="يظهر للزوار باللغة الإنجليزية" error={errors.header_tagline_en?.message}>
                  <input {...register('header_tagline_en')} className={inputCls} placeholder="Fast Shipping | Best Prices" dir="ltr" />
                </Field>
              </div>

              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">
                نصوص الصفحة الرئيسية (Home Page)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="عنوان الصفحة الرئيسية (بالعربية)" error={errors.index_title_ar?.message}>
                  <input {...register('index_title_ar')} className={inputCls} placeholder="مرحباً بكم في متجرنا" />
                </Field>
                <Field label="عنوان الصفحة الرئيسية (بالإنجليزية)" error={errors.index_title_en?.message}>
                  <input {...register('index_title_en')} className={inputCls} placeholder="Welcome to our store" dir="ltr" />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="وصف الصفحة الرئيسية (بالعربية)" error={errors.index_description_ar?.message}>
                  <textarea {...register('index_description_ar')} className={`${inputCls} resize-none`} rows={2} placeholder="أفضل تجربة تسوق إلكتروني." />
                </Field>
                <Field label="وصف الصفحة الرئيسية (بالإنجليزية)" error={errors.index_description_en?.message}>
                  <textarea {...register('index_description_en')} className={`${inputCls} resize-none`} rows={2} placeholder="Best online shopping experience." dir="ltr" />
                </Field>
              </div>
            </>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <>
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" /> بيانات التواصل
              </h2>
              <Field label="البريد الإلكتروني" error={errors.contact_email?.message}>
                <input {...register('contact_email')} type="email" className={inputCls} placeholder="info@store.com" />
              </Field>
              <Field label="رقم الهاتف" hint="يظهر في الهيدر والفوتر" error={errors.contact_phone?.message}>
                <input {...register('contact_phone')} className={inputCls} placeholder="01012345678" dir="ltr" />
              </Field>
              <Field label="رقم واتساب" hint="رقم دولي بدون مسافات مثل 201012345678" error={errors.whatsapp?.message}>
                <input {...register('whatsapp')} className={inputCls} placeholder="201012345678" dir="ltr" />
              </Field>
              <Field label="عنوان المتجر" error={errors.address?.message}>
                <textarea {...register('address')} className={`${inputCls} resize-none`} rows={2} placeholder="القاهرة، مصر" />
              </Field>
              <Field label="رابط خريطة المتجر (Google Maps Iframe)" hint="قم بنسخ رابط الـ src من تضمين خرائط جوجل (Iframe) وضعه هنا لعرض الخريطة في صفحة اتصل بنا" error={errors.store_location_map?.message}>
                <input {...register('store_location_map')} className={inputCls} placeholder="https://www.google.com/maps/embed?pb=..." dir="ltr" />
              </Field>
            </>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <>
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-600" /> وسائل التواصل الاجتماعي
              </h2>
              
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">روابط تواصل إضافية</h3>
                  <button
                    type="button"
                    onClick={() => append({ id: Date.now().toString(), name: '', url: '' })}
                    className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> إضافة رابط
                  </button>
                </div>
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input
                          {...register(`custom_social_links.${index}.name` as const)}
                          className={inputCls}
                          placeholder="اسم الموقع (مثال: سناب شات)"
                        />
                        <input
                          {...register(`custom_social_links.${index}.url` as const)}
                          className={inputCls}
                          placeholder="الرابط"
                          dir="ltr"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">لا توجد روابط إضافية. انقر على &quot;إضافة رابط&quot;</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Image className="w-5 h-5 text-blue-600" /> إعدادات المظهر والشعار
              </h2>

              {/* 1. Header Logo */}
              <div className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                    لوجو الهيدر (Header Logo)
                  </label>
                  <span className="text-xs text-gray-400">يظهر في الشريط العلوي للموقع</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input {...register('logo')} className={inputCls} placeholder="رابط لوجو الهيدر أو اضغط رفع..." dir="ltr" />
                  </div>
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
                    <Upload className="w-4 h-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                    {uploadingField === 'logo' ? 'جاري الرفع...' : 'رفع اللوجو'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e, 'logo')}
                      disabled={uploadingField !== null}
                    />
                  </label>
                </div>
                {errors.logo?.message && <p className="text-xs text-red-500">{errors.logo?.message}</p>}
                {currentLogo && (
                  <div className="mt-3 flex items-center gap-3">
                    <p className="text-xs text-gray-500">معاينة لوجو الهيدر:</p>
                    <div className="h-12 px-3 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center">
                      <img src={currentLogo} alt="Header Logo preview" className="max-h-10 max-w-[160px] object-contain" />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Footer Logo */}
              <div className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                    لوجو الفوتر (Footer Logo)
                  </label>
                  <span className="text-xs text-gray-400">يظهر في فوتر الموقع (خلفية داكنة bg-gray-900)</span>
                </div>
                <p className="text-xs text-gray-500">
                  إذا لم تقم برفع لوجو مخصص للفوتر، سيتم استخدام لوجو الهيدر تلقائياً. يُفضل استخدام لوجو ملون أو أبيض يناسب الخلفية الداكنة.
                </p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input {...register('footer_logo')} className={inputCls} placeholder="رابط لوجو الفوتر أو اضغط رفع..." dir="ltr" />
                  </div>
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
                    <Upload className="w-4 h-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                    {uploadingField === 'footer_logo' ? 'جاري الرفع...' : 'رفع لوجو الفوتر'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e, 'footer_logo')}
                      disabled={uploadingField !== null}
                    />
                  </label>
                </div>
                {errors.footer_logo?.message && <p className="text-xs text-red-500">{errors.footer_logo?.message}</p>}
                {(currentFooterLogo || currentLogo) && (
                  <div className="mt-3 flex items-center gap-3">
                    <p className="text-xs text-gray-500">معاينة لوجو الفوتر (على خلفية الفوتر):</p>
                    <div className="h-14 px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl flex items-center justify-center shadow-inner">
                      <img src={currentFooterLogo || currentLogo} alt="Footer Logo preview" className="max-h-10 max-w-[180px] object-contain" />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Favicon */}
              <div className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                    أيقونة الموقع (Favicon)
                  </label>
                  <span className="text-xs text-gray-400">تظهر في تبويب المتصفح</span>
                </div>
                <p className="text-xs text-gray-500">
                  المقاس الموصى به: 32×32 أو 64×64 بكسل بصيغة PNG أو ICO أو SVG.
                </p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input {...register('favicon')} className={inputCls} placeholder="رابط الـ Favicon أو اضغط رفع..." dir="ltr" />
                  </div>
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
                    <Upload className="w-4 h-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                    {uploadingField === 'favicon' ? 'جاري الرفع...' : 'رفع الـ Favicon'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e, 'favicon')}
                      disabled={uploadingField !== null}
                    />
                  </label>
                </div>
                {errors.favicon?.message && <p className="text-xs text-red-500">{errors.favicon?.message}</p>}
                {currentFavicon && (
                  <div className="mt-3 flex items-center gap-3">
                    <p className="text-xs text-gray-500">معاينة الـ Favicon:</p>
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1.5 flex items-center justify-center shadow-sm">
                      <img src={currentFavicon} alt="Favicon preview" className="w-6 h-6 object-contain" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="space-y-6">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 border-b border-gray-200 pb-3">
                <FileText className="w-5 h-5 text-blue-600" /> السياسات وشروط الاستخدام
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <Field label="عنوان سياسة الخصوصية (بالعربية)" error={errors.privacy_policy_title_ar?.message}>
                  <input {...register('privacy_policy_title_ar')} className={inputCls} placeholder="سياسة الخصوصية" />
                </Field>
                <Field label="نص سياسة الخصوصية (بالعربية)" error={errors.privacy_policy_ar?.message}>
                  <div className="bg-white dark:bg-gray-800 text-black">
                    <Controller
                      name="privacy_policy_ar"
                      control={control}
                      render={({ field }) => (
                        <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className="h-64 mb-12" />
                      )}
                    />
                  </div>
                </Field>
                <Field label="عنوان سياسة الخصوصية (بالإنجليزية)" error={errors.privacy_policy_title_en?.message}>
                  <input {...register('privacy_policy_title_en')} className={inputCls} placeholder="Privacy Policy" dir="ltr" />
                </Field>
                <Field label="نص سياسة الخصوصية (بالإنجليزية)" error={errors.privacy_policy_en?.message}>
                  <div className="bg-white dark:bg-gray-800 text-black" dir="ltr">
                    <Controller
                      name="privacy_policy_en"
                      control={control}
                      render={({ field }) => (
                        <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className="h-64 mb-12" />
                      )}
                    />
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-6 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <Field label="عنوان شروط الاستخدام (بالعربية)" error={errors.terms_of_use_title_ar?.message}>
                  <input {...register('terms_of_use_title_ar')} className={inputCls} placeholder="شروط الاستخدام" />
                </Field>
                <Field label="نص شروط الاستخدام (بالعربية)" error={errors.terms_of_use_ar?.message}>
                  <div className="bg-white dark:bg-gray-800 text-black">
                    <Controller
                      name="terms_of_use_ar"
                      control={control}
                      render={({ field }) => (
                        <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className="h-64 mb-12" />
                      )}
                    />
                  </div>
                </Field>
                <Field label="عنوان شروط الاستخدام (بالإنجليزية)" error={errors.terms_of_use_title_en?.message}>
                  <input {...register('terms_of_use_title_en')} className={inputCls} placeholder="Terms of Use" dir="ltr" />
                </Field>
                <Field label="نص شروط الاستخدام (بالإنجليزية)" error={errors.terms_of_use_en?.message}>
                  <div className="bg-white dark:bg-gray-800 text-black" dir="ltr">
                    <Controller
                      name="terms_of_use_en"
                      control={control}
                      render={({ field }) => (
                        <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className="h-64 mb-12" />
                      )}
                    />
                  </div>
                </Field>
              </div>
            </div>
          )}
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

const inputCls = "w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-b border-gray-200lue-400 outline-none transition-all";

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
