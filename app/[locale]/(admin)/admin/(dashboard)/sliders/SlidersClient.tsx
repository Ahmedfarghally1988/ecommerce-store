"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HeroSlide } from '@prisma/client';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Upload, 
  Image as ImageIcon, 
  Smartphone, 
  Monitor, 
  Check, 
  X, 
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/shared/ui/Button';
import { Input } from '@/components/shared/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/Table';
import { Modal } from '@/components/shared/ui/Modal';
import { useToast } from '@/components/shared/ui/Toast';
import { heroSlideSchema, HeroSlideInput } from '@/lib/validations/admin-slide';
import { 
  createHeroSlide, 
  updateHeroSlide, 
  deleteHeroSlide, 
  toggleHeroSlideStatus 
} from '@/app/actions/admin/sliders';
import Image from 'next/image';

interface SlidersClientProps {
  initialSlides: HeroSlide[];
}

export function SlidersClient({ initialSlides }: SlidersClientProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMobileImage, setUploadingMobileImage] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewLocale, setPreviewLocale] = useState<'en' | 'ar'>('en');
  const { showToast } = useToast();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<HeroSlideInput>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      titleEn: '',
      titleAr: '',
      descriptionEn: '',
      descriptionAr: '',
      image: '',
      mobileImage: '',
      buttonTextEn: '',
      buttonTextAr: '',
      buttonUrl: '',
      isActive: true,
      sortOrder: 0,
    }
  });

  const watchValues = watch();

  const openModal = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide(slide);
      reset({
        titleEn: slide.titleEn,
        titleAr: slide.titleAr,
        descriptionEn: slide.descriptionEn || '',
        descriptionAr: slide.descriptionAr || '',
        image: slide.image,
        mobileImage: slide.mobileImage || '',
        buttonTextEn: slide.buttonTextEn || '',
        buttonTextAr: slide.buttonTextAr || '',
        buttonUrl: slide.buttonUrl || '',
        isActive: slide.isActive,
        sortOrder: slide.sortOrder,
      });
    } else {
      setEditingSlide(null);
      reset({
        titleEn: '',
        titleAr: '',
        descriptionEn: '',
        descriptionAr: '',
        image: '',
        mobileImage: '',
        buttonTextEn: 'Shop Now',
        buttonTextAr: 'تسوق الآن',
        buttonUrl: '/products',
        isActive: true,
        sortOrder: slides.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'mobileImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploading = field === 'image' ? setUploadingImage : setUploadingMobileImage;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setValue(field, data.url, { shouldValidate: true });
      showToast('Image uploaded successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: HeroSlideInput) => {
    try {
      if (editingSlide) {
        const updated = await updateHeroSlide(editingSlide.id, data);
        setSlides(prev => prev.map(s => s.id === editingSlide.id ? updated : s).sort((a, b) => a.sortOrder - b.sortOrder));
        showToast('تم تحديث الشريحة بنجاح', 'success');
      } else {
        const created = await createHeroSlide(data);
        setSlides(prev => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder));
        showToast('تم إنشاء الشريحة بنجاح', 'success');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      showToast(error.message || 'فشل حفظ الشريحة', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الشريحة؟')) {
      try {
        await deleteHeroSlide(id);
        setSlides(prev => prev.filter(s => s.id !== id));
        showToast('تم حذف الشريحة بنجاح', 'success');
      } catch (error: any) {
        showToast('فشل حذف الشريحة', 'error');
      }
    }
  };

  const handleToggleStatus = async (slide: HeroSlide) => {
    try {
      const newStatus = !slide.isActive;
      await toggleHeroSlideStatus(slide.id, newStatus);
      setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, isActive: newStatus } : s));
      showToast(`تم ${newStatus ? 'تفعيل' : 'إيقاف'} الشريحة`, 'success');
    } catch (error: any) {
      showToast('فشل تغيير حالة الشريحة', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            إدارة سلايدر العروض
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            إدارة السلايدر الرئيسي في الصفحة الرئيسية، البنرات، النصوص، وروابط الأزرار.
          </p>
        </div>
        <Button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
          إضافة شريحة
        </Button>
      </div>

      {/* Slides Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead className="w-16">الترتيب</TableHead>
            <TableHead className="w-32">المعاينة</TableHead>
            <TableHead>العنوان الإنجليزي</TableHead>
            <TableHead>العنوان العربي</TableHead>
            <TableHead>رابط الزر</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-right rtl:text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slides.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500 py-12">
                <ImageIcon className="h-10 w-10  mb-2 text-gray-400" />
                <p className="text-base font-medium">لا توجد شرائح</p>
                <p className="text-sm text-gray-400">انقر على &quot;إضافة شريحة&quot; لإنشاء أول شريحة.</p>
              </TableCell>
            </TableRow>
          ) : (
            slides.map((slide, index) => (
              <TableRow key={slide.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-semibold text-gray-700 dark:text-gray-300">
                  #{slide.sortOrder}
                </TableCell>
                <TableCell>
                  <div className="relative w-24 h-14 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                    {slide.image ? (
                      <Image 
                        src={slide.image} 
                        alt={slide.titleEn} 
                        fill 
                        className="object-cover" 
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                  {slide.titleEn}
                  {slide.descriptionEn && (
                    <p className="text-xs text-gray-500 truncate w-full">{slide.descriptionEn}</p>
                  )}
                </TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-gray-100" dir="rtl">
                  {slide.titleAr ? (
                    slide.titleAr
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-normal text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-0.5 rounded-full">
                      صورة فقط (بدون نصوص)
                    </span>
                  )}
                  {slide.descriptionAr && (
                    <p className="text-xs text-gray-500 truncate w-full">{slide.descriptionAr}</p>
                  )}
                </TableCell>
                <TableCell>
                  {slide.buttonUrl ? (
                    <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-blue-600 truncate inline-block max-w-[150px]">
                      {slide.buttonUrl}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(slide)}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors ${
                      slide.isActive 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300'
                    }`}
                  >
                    {slide.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {slide.isActive ? 'نشط' : 'غير نشط'}
                  </button>
                </TableCell>
                <TableCell className="text-right rtl:text-left">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Edit slide"
                      onClick={() => openModal(slide)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Delete slide"
                      className="text-red-500 hover:text-red-700" 
                      onClick={() => handleDelete(slide.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Slide Add/Edit Modal with Live Preview */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingSlide ? 'تعديل الشريحة' : 'إنشاء شريحة جديدة'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Live Preview Box */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-900 shadow-inner">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-xs text-gray-300 border-b border-gray-200 border-gray-700">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold">معاينة حية</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-700 rounded p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    title="Mobile Preview"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center bg-gray-700 rounded p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewLocale('en')}
                    className={`px-2 py-0.5 rounded text-xs ${previewLocale === 'en' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLocale('ar')}
                    className={`px-2 py-0.5 rounded text-xs ${previewLocale === 'ar' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    العربية
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Canvas */}
            <div className={` transition-all ${previewDevice === 'mobile' ? 'max-w-[320px]' : 'w-full'}`}>
              <div 
                className="relative h-48 sm:h-56 w-full flex items-center justify-center overflow-hidden"
                dir={previewLocale === 'ar' ? 'rtl' : 'ltr'}
              >
                {/* Preview Image */}
                {watchValues.image ? (
                  <Image 
                    src={previewDevice === 'mobile' && watchValues.mobileImage ? watchValues.mobileImage : watchValues.image}
                    alt="Preview"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="600px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center text-gray-500 text-xs">
                    يرجى توفير رابط الصورة أو رفع صورة
                  </div>
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Preview Content */}
                <div className="relative z-10 w-full p-4 text-white text-center flex flex-col items-center">
                  {(previewLocale === 'ar' ? watchValues.titleAr : watchValues.titleEn) && (
                    <h3 className="text-base sm:text-lg font-bold tracking-tight leading-tight line-clamp-1">
                      {previewLocale === 'ar' ? watchValues.titleAr : watchValues.titleEn}
                    </h3>
                  )}
                  {(previewLocale === 'ar' ? watchValues.descriptionAr : watchValues.descriptionEn) && (
                    <p className="text-xs text-gray-200 mt-1 line-clamp-2 w-full max-w-md">
                      {previewLocale === 'ar' ? watchValues.descriptionAr : watchValues.descriptionEn}
                    </p>
                  )}
                  {(previewLocale === 'ar' ? watchValues.buttonTextAr : watchValues.buttonTextEn) && (
                    <div className="mt-2.5">
                      <span className="inline-block bg-white text-black font-semibold px-4 py-1 rounded-full text-xs shadow">
                        {previewLocale === 'ar' ? watchValues.buttonTextAr : watchValues.buttonTextEn}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields: English Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              English Content (Optional)
            </h4>
            <Input 
              label="English Title (Optional)" 
              placeholder="e.g. Discover The Future of Tech (leave blank for image only)"
              {...register('titleEn')} 
              error={errors.titleEn?.message} 
            />
            <Input 
              label="English Description (Optional)" 
              placeholder="e.g. Exclusive deals on premium flagship devices."
              {...register('descriptionEn')} 
              error={errors.descriptionEn?.message} 
            />
            <Input 
              label="English Button Text (Optional)" 
              placeholder="e.g. Shop Collection"
              {...register('buttonTextEn')} 
              error={errors.buttonTextEn?.message} 
            />
          </div>

          {/* Form Fields: Arabic Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50" dir="rtl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 text-right">
              المحتوى العربي (اختياري)
            </h4>
            <Input 
              label="العنوان باللغة العربية (اختياري)" 
              placeholder="مثال: اكتشف مستقبل التكنولوجيا (اتركه فارغاً لرفع صورة فقط)"
              {...register('titleAr')} 
              error={errors.titleAr?.message} 
            />
            <Input 
              label="الوصف باللغة العربية (اختياري)" 
              placeholder="مثال: عروض حصرية على أحدث الهواتف والأجهزة الذكية."
              {...register('descriptionAr')} 
              error={errors.descriptionAr?.message} 
            />
            <Input 
              label="نص الزر بالعربية (اختياري)" 
              placeholder="مثال: تسوق الآن"
              {...register('buttonTextAr')} 
              error={errors.buttonTextAr?.message} 
            />
          </div>

          {/* Media Section: Desktop & Mobile Images */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Slide Images & Media
            </h4>
            
            {/* Desktop Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
                <span>Desktop Image (Required)</span>
                <span className="text-xs text-gray-400">1920x600 أو 1440x480 (نسبة 3:1)</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input 
                    placeholder="Enter image URL or upload below"
                    {...register('image')} 
                    error={errors.image?.message} 
                  />
                </div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md text-sm font-medium transition-colors border border-gray-300 dark:border-gray-600">
                  <Upload className="w-4 h-4 mr-1.5" />
                  {uploadingImage ? 'Uploading...' : 'Upload'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'image')}
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>

            {/* Mobile Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
                <span>Mobile Image (Optional)</span>
                <span className="text-xs text-gray-400">768x900 recommended for portrait</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input 
                    placeholder="Enter mobile image URL (optional)"
                    {...register('mobileImage')} 
                    error={errors.mobileImage?.message} 
                  />
                </div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md text-sm font-medium transition-colors border border-gray-300 dark:border-gray-600">
                  <Upload className="w-4 h-4 mr-1.5" />
                  {uploadingMobileImage ? 'Uploading...' : 'Upload'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'mobileImage')}
                    disabled={uploadingMobileImage}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Link & Settings Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Button Target URL" 
              placeholder="e.g. /products or /category/phones"
              {...register('buttonUrl')} 
              error={errors.buttonUrl?.message} 
            />
            <Input 
              label="Sort Order" 
              type="number"
              placeholder="0"
              {...register('sortOrder')} 
              error={errors.sortOrder?.message} 
            />
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <input 
              type="checkbox" 
              id="isActiveSlide" 
              {...register('isActive')} 
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
            />
            <label htmlFor="isActiveSlide" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active (Visible on Storefront Homepage)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {editingSlide ? 'تحديث الشريحة' : 'حفظ الشريحة'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
