"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema, ProfileUpdateInput } from '@/lib/validations/auth';
import { getCustomerProfile, updateCustomerProfile } from '@/app/actions/customer/profile';
import { Camera, Save, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ProfilePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isAr = locale === 'ar';
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
  });

  const watchAvatar = watch('avatar');

  useEffect(() => {
    getCustomerProfile().then((profile) => {
      reset({ name: profile.name, phone: profile.phone || '', avatar: profile.avatar || '' });
      setAvatarPreview(profile.avatar || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [reset]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload/avatar', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setValue('avatar', data.url, { shouldValidate: true });
      setAvatarPreview(data.url);
    } catch (e: any) {
      setErrorMsg(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileUpdateInput) => {
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await updateCustomerProfile(data);
      setSuccessMsg(isAr ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to update profile');
    }
  };

  if (loading) return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center">
      <div className="animate-spin w-6 h-6 border-2 border-b border-gray-200lue-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">{isAr ? 'تعديل الملف الشخصي' : 'Edit Profile'}</h2>

        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>U</span>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md transition-colors">
                {uploading ? <span className="text-[10px]">...</span> : <Camera className="w-3.5 h-3.5" />}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            </div>
            <div className="text-center sm:text-start">
              <p className="font-medium text-gray-900">{isAr ? 'صورة الملف الشخصي' : 'Profile Photo'}</p>
              <p className="text-xs text-gray-500 mt-0.5">{isAr ? 'JPG أو PNG، الحجم الأقصى 5 ميجا' : 'JPG or PNG, max 5MB'}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{isAr ? 'الاسم الكامل' : 'Full Name'} <span className="text-red-400">*</span></label>
            <input
              {...register('name')}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
            <input
              {...register('phone')}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          {/* Email note */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-500">
            ℹ️ {isAr ? 'لا يمكن تغيير البريد الإلكتروني. تواصل مع الدعم إذا كنت بحاجة لتغييره.' : 'Email cannot be changed. Contact support if you need to update it.'}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
