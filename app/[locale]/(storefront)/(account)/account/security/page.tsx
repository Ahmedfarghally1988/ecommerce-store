"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordInput } from '@/lib/validations/auth';
import { changeCustomerPassword } from '@/app/actions/customer/profile';
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SecurityPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isAr = locale === 'ar';
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setSuccessMsg(''); setErrorMsg('');
    try {
      await changeCustomerPassword(data);
      setSuccessMsg(isAr ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully');
      reset();
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to change password');
    }
  };

  return (
    <div className="space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Lock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{isAr ? 'تغيير كلمة المرور' : 'Change Password'}</h2>
            <p className="text-sm text-gray-500">{isAr ? 'استخدم كلمة مرور قوية لحماية حسابك' : 'Use a strong password to keep your account secure'}</p>
          </div>
        </div>

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {isAr ? 'كلمة المرور الحالية' : 'Current Password'} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                {...register('currentPassword')}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 pr-12 transition-all"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {isAr ? 'كلمة المرور الجديدة' : 'New Password'} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                {...register('newPassword')}
                placeholder={isAr ? '8 أحرف على الأقل' : 'At least 8 characters'}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 pr-12 transition-all"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}                
              </button>
            </div>
            {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                {...register('confirmNewPassword')}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 pr-12 transition-all"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmNewPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmNewPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            {isSubmitting ? (isAr ? 'جاري التغيير...' : 'Changing...') : (isAr ? 'تغيير كلمة المرور' : 'Change Password')}
          </button>
        </form>
      </div>
    </div>
  );
}
