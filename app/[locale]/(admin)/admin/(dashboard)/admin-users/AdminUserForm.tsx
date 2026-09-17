"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAdminUser, updateAdminUser } from '@/app/actions/admin/adminUsers';
import {
  Shield, Key, User, Mail, Lock, Check,
  LayoutDashboard, Package, Tags, Building2,
  ShoppingCart, Users, Ticket, Sliders, Image as ImageIcon,
  Settings, CheckSquare, Square, ArrowRight
} from 'lucide-react';

const GROUP_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  dashboard: { label: 'لوحة التحكم', icon: LayoutDashboard, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
  products: { label: 'المنتجات', icon: Package, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
  categories: { label: 'الأقسام', icon: Tags, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
  brands: { label: 'الماركات التجارية', icon: Building2, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' },
  orders: { label: 'الطلبات والمبيعات', icon: ShoppingCart, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' },
  customers: { label: 'العملاء', icon: Users, color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/30' },
  admin_users: { label: 'إدارة المديرين', icon: Shield, color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/30' },
  coupons: { label: 'الكوبونات والخصومات', icon: Ticket, color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/30' },
  sliders: { label: 'سلايدر العروض', icon: Sliders, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/30' },
  media: { label: 'مكتبة الوسائط', icon: ImageIcon, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30' },
  newsletter: { label: 'النشرة البريدية', icon: Mail, color: 'text-sky-600 bg-sky-50 dark:bg-sky-900/30' },
  settings: { label: 'إعدادات المتجر', icon: Settings, color: 'text-gray-600 bg-gray-100 dark:bg-gray-800' },
};

const ACTION_LABELS: Record<string, string> = {
  view: 'عرض واستعراض',
  create: 'إضافة جديد',
  edit: 'تعديل وتحديث',
  delete: 'حذف',
  send: 'إرسال رسائل وحملات',
  approve: 'الموافقة والرفض',
  suspend: 'إيقاف وتفعيل',
  permissions: 'إدارة الصلاحيات',
};

function SwitchToggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: () => void;
  id?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
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

export default function AdminUserForm({ initialData, permissionsList = [], currentAdminRole }: any) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'ADMIN',
    status: initialData?.status || 'ACTIVE',
    avatar: initialData?.avatar || '',
    permissions: initialData?.permissions?.map((p: any) => p.permission.id) || [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const isSuperAdmin = currentAdminRole === 'SUPER_ADMIN';

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
      setFormData((prev) => ({ ...prev, avatar: data.url }));
    } catch (err: any) {
      setUploadError(err.message || 'فشل رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const togglePermission = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter((pid: string) => pid !== id)
        : [...prev.permissions, id],
    }));
  };

  const selectGroup = (prefix: string) => {
    const groupPerms = permissionsList
      .filter((p: any) => p.action.startsWith(prefix))
      .map((p: any) => p.id);
    const hasAll = groupPerms.every((id: string) => formData.permissions.includes(id));

    setFormData((prev) => {
      let newPerms = [...prev.permissions];
      if (hasAll) {
        newPerms = newPerms.filter((id: string) => !groupPerms.includes(id));
      } else {
        groupPerms.forEach((id: string) => {
          if (!newPerms.includes(id)) newPerms.push(id);
        });
      }
      return { ...prev, permissions: newPerms };
    });
  };

  const selectAllPermissions = () => {
    const allIds = permissionsList.map((p: any) => p.id);
    setFormData((prev) => ({ ...prev, permissions: allIds }));
  };

  const deselectAllPermissions = () => {
    setFormData((prev) => ({ ...prev, permissions: [] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (initialData) {
        await updateAdminUser(initialData.id, formData);
      } else {
        if (!formData.password) throw new Error('كلمة المرور مطلوبة للمدير الجديد');
        await createAdminUser(formData);
      }
      router.push('/admin/admin-users');
    } catch (err: any) {
      setError(err.message || 'فشل حفظ بيانات المدير');
    } finally {
      setLoading(false);
    }
  };

  const permissionGroups = permissionsList.reduce((acc: any, perm: any) => {
    const [group] = perm.action.split('.');
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  }, {});

  const allSelected =
    permissionsList.length > 0 &&
    formData.permissions.length === permissionsList.length;

  return (
    <div className="w-full space-y-6">
      {/* ── Page Title Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {initialData ? 'تعديل بيانات المدير' : 'إضافة مدير جديد'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            قم بتعبئة بيانات المدير وتحديد الصلاحيات المخصصة له بدقة
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>رجوع</span>
        </button>
      </div>

      {/* ── Main Form ── */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-8 shadow-sm"
      >
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-xl text-xs border border-red-200 dark:border-red-900 font-medium">
            {error}
          </div>
        )}

        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4 py-2 border-b border-gray-200 border-gray-100 dark:border-gray-800">
          {formData.avatar ? (
            <img
              src={formData.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover shadow-sm border border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold shadow-sm">
              {formData.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          )}

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm">
                {uploading ? 'جاري الرفع...' : 'تغيير الصورة الشخصية'}
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
                  className="text-red-600 hover:text-red-700 text-xs font-medium hover:underline"
                >
                  إزالة الصورة
                </button>
              )}
            </div>
            {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
          </div>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              الاسم بالكامل *
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: أحمد محمد"
              className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:bg-white focus:border-b border-gray-200lue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              البريد الإلكتروني *
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@example.com"
              dir="ltr"
              className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:bg-white focus:border-b border-gray-200lue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              كلمة المرور {initialData && <span className="text-gray-400 font-normal">(اتركه فارغاً للإبقاء على الحالية)</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={initialData ? '••••••••' : 'أدخل كلمة مرور قوية'}
              dir="ltr"
              className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:bg-white focus:border-b border-gray-200lue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              الدور الوظيفي
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={!isSuperAdmin || initialData?.role === 'SUPER_ADMIN'}
              className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:bg-white focus:border-b border-gray-200lue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all disabled:opacity-60 text-gray-900 dark:text-gray-100"
            >
              <option value="ADMIN">ADMIN (مدير بصلاحيات مخصصة)</option>
              {isSuperAdmin && <option value="SUPER_ADMIN">SUPER ADMIN (مدير عام بكافة الصلاحيات)</option>}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              حالة الحساب
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              disabled={initialData?.role === 'SUPER_ADMIN'}
              className="w-full md:w-1/2 px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:bg-white focus:border-b border-gray-200lue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all disabled:opacity-60 text-gray-900 dark:text-gray-100"
            >
              <option value="ACTIVE">نشط (Active) - يمكنه تسجيل الدخول</option>
              <option value="SUSPENDED">موقوف (Suspended) - محظور من الدخول</option>
            </select>
          </div>
        </div>

        {/* ── Custom Permissions Section (Only for ADMIN role) ── */}
        {formData.role === 'ADMIN' && (
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 space-y-5">
            
            {/* Header with Title and Bulk Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/70 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>الصلاحيات المخصصة</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                      {formData.permissions.length} من أصل {permissionsList.length} محددة
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    قم بتفعيل أو تعطيل الأقسام والوظائف المسموح للمدير بالوصول إليها عبر مفاتيح التبديل
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllPermissions}
                  className="px-3.5 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors shadow-sm"
                >
                  تحديد الكل
                </button>
                <button
                  type="button"
                  onClick={deselectAllPermissions}
                  className="px-3.5 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors shadow-sm"
                >
                  إلغاء التحديد
                </button>
              </div>
            </div>

            {/* Permission Blocks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(permissionGroups).map(([group, perms]: any) => {
                const groupInfo = GROUP_META[group] || {
                  label: group,
                  icon: Shield,
                  color: 'text-gray-600 bg-gray-100 dark:bg-gray-800',
                };
                const GroupIcon = groupInfo.icon;
                const activeInGroup = perms.filter((p: any) => formData.permissions.includes(p.id)).length;
                const allInGroupSelected = activeInGroup === perms.length;

                return (
                  <div
                    key={group}
                    className="bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all flex flex-col justify-between"
                  >
                    {/* Block Header */}
                    <div>
                      <div className="flex items-center justify-between mb-3 border-b border-gray-200 border-gray-100 dark:border-gray-700/80 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${groupInfo.color}`}>
                            <GroupIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200">
                              {groupInfo.label}
                            </h4>
                            <span className="text-[10px] text-gray-400 font-mono">
                              ({activeInGroup} / {perms.length})
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => selectGroup(group)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                            allInGroupSelected
                              ? 'bg-blue-50 border-b border-gray-200lue-200 text-blue-600 dark:bg-blue-900/30 dark:border-b border-gray-200lue-800'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {allInGroupSelected ? 'إلغاء' : 'تحديد الكل'}
                        </button>
                      </div>

                      {/* Permission Rows with Switch Toggle */}
                      <div className="space-y-1">
                        {perms.map((perm: any) => {
                          const actionKey = perm.action.split('.')[1] || perm.action;
                          const actionLabel = ACTION_LABELS[actionKey] || actionKey;
                          const isChecked = formData.permissions.includes(perm.id);

                          return (
                            <div
                              key={perm.id}
                              onClick={() => togglePermission(perm.id)}
                              className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors border ${
                                isChecked
                                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-b border-gray-200lue-100 dark:border-b border-gray-200lue-900/40'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/40 border-transparent hover:border-gray-100 dark:hover:border-gray-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1 pe-2">
                                <span className={`text-xs font-semibold ${
                                  isChecked ? 'text-blue-950 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {actionLabel}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  ({actionKey})
                                </span>
                              </div>

                              <SwitchToggle
                                checked={isChecked}
                                onChange={() => togglePermission(perm.id)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Block Footer Indicator */}
                    <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[11px]">
                      <span className="text-gray-400 text-[10px]">حالة الصلاحية:</span>
                      <span className={`font-semibold text-[10px] ${
                        activeInGroup === perms.length
                          ? 'text-emerald-600'
                          : activeInGroup > 0
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}>
                        {activeInGroup === perms.length
                          ? 'كامل الصلاحيات'
                          : activeInGroup > 0
                          ? 'صلاحيات جزئية'
                          : 'معطلة بالكامل'}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ── Form Actions ── */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            إلغاء
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <span>حفظ البيانات</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
