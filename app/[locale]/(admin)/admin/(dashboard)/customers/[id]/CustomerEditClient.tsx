"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateCustomerAdmin } from '@/app/actions/admin/customers';
import { Save, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
}

export default function CustomerEditClient({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone || '',
    avatar: customer.avatar || '',
    password: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload/avatar', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFormData(prev => ({ ...prev, avatar: data.url }));
    } catch (err: any) {
      setUploadError(err.message || 'فشل رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateCustomerAdmin(customer.id, formData);
        router.push('/admin/customers');
      } catch (error) {
        console.error('Failed to update customer', error);
      }
    });
  };

  return (
    <div className="w-full  space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">تعديل الملف الشخصي</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
        <div className="flex flex-col items-center gap-4 mb-6">
          {formData.avatar ? (
            <img src={formData.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-sm border border-gray-100" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-sm">
              {formData.name?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الهاتف</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة (اختياري)</label>
            <input
              type="text"
              value={formData.password || ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="اتركه فارغاً إذا لم ترغب في تغييره"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">اكتب كلمة مرور جديدة هنا لتغيير كلمة مرور العميل.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الصورة الشخصية (Avatar)</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="relative cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
                {uploading ? 'جاري الرفع...' : 'اختر صورة للرفع'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </label>
              {formData.avatar && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: '' })}
                  className="text-red-600 text-sm hover:underline"
                >
                  إزالة الصورة
                </button>
              )}
            </div>
            {uploadError && <p className="mt-2 text-xs text-red-500">{uploadError}</p>}
            <p className="text-xs text-gray-500 mt-2">JPG أو PNG، الحجم الأقصى 5 ميجا.</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {isPending ? <span className="animate-spin">⟳</span> : <Save className="w-5 h-5" />}
            حفظ التعديلات
          </button>
        </div>
      </form>
    </div>
  );
}
