"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { suspendAdminUser, activateAdminUser, deleteAdminUser } from '@/app/actions/admin/adminUsers';
import { Shield, ShieldAlert, UserMinus, UserPlus, Search, Edit, Trash2, Check } from 'lucide-react';

interface Permission {
  id: string;
  action: string;
  description: string | null;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: 'SUPER_ADMIN' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  _count: { permissions: number };
}

interface AdminUsersClientProps {
  initialUsers: AdminUser[];
  permissionsList: Permission[];
  currentAdminRole: string;
}

export default function AdminUsersClient({ initialUsers, permissionsList, currentAdminRole }: AdminUsersClientProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'ar';

  const filtered = users.filter((u) => {
    return !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
  });

  const handleAction = async (id: string, action: 'suspend' | 'activate' | 'delete') => {
    if (action === 'delete' && !confirm('هل أنت متأكد من حذف هذا المدير؟')) return;
    
    setActionLoading(id + action);
    try {
      if (action === 'suspend') await suspendAdminUser(id);
      if (action === 'activate') await activateAdminUser(id);
      if (action === 'delete') {
        await deleteAdminUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
        return;
      }

      setUsers((prev) => prev.map((u) => {
        if (u.id !== id) return u;
        return { ...u, status: action === 'activate' ? 'ACTIVE' : 'SUSPENDED' };
      }));
    } catch (e: any) {
      alert(e.message || 'فشلت العملية');
    } finally {
      setActionLoading(null);
    }
  };

  // Render
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">المدراء</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">إدارة حسابات المديرين وصلاحياتهم</p>
        </div>
        <Link
          href={`/${locale}/admin/admin-users/create`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          إضافة مدير جديد
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-0 overflow-hidden p-4 md:p-6">
        <div className="flex items-center gap-1 pb-4 mb-4 border-b border-gray-200 border-gray-100 dark:border-gray-800">
          <div className="relative px-2 flex-1">
            <Search className="absolute right-5 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو البريد..."
              className="pr-9 pl-4 py-2 border border-gray-100 dark:border-gray-800 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="border-b border-gray-200 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="px-6 py-4 font-semibold text-gray-500 w-16">#</th>
                <th className="px-6 py-4 font-semibold text-gray-500">المدير</th>
                <th className="px-6 py-4 font-semibold text-gray-500">الدور</th>
                <th className="px-6 py-4 font-semibold text-gray-500">الصلاحيات</th>
                <th className="px-6 py-4 font-semibold text-gray-500">الحالة</th>
                <th className="px-6 py-4 font-semibold text-gray-500">تاريخ الإضافة</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'SUPER_ADMIN' ? (
                      <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-100 px-2 py-1 rounded-md text-xs font-bold">
                        <ShieldAlert className="w-3 h-3" /> SUPER ADMIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-100 px-2 py-1 rounded-md text-xs font-bold">
                        <Shield className="w-3 h-3" /> ADMIN
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'SUPER_ADMIN' ? 'الكل (Full Access)' : `${user._count.permissions} صلاحية`}
                  </td>
                  <td className="px-6 py-4">
                    {user.status === 'ACTIVE' ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium">نشط</span>
                    ) : (
                      <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-medium">موقوف</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/${locale}/admin/admin-users/${user.id}/edit`}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      {user.status === 'ACTIVE' ? (
                        <button
                          onClick={() => handleAction(user.id, 'suspend')}
                          disabled={actionLoading === user.id + 'suspend' || user.role === 'SUPER_ADMIN'}
                          className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                          title="إيقاف"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction(user.id, 'activate')}
                          disabled={actionLoading === user.id + 'activate'}
                          className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="تفعيل"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleAction(user.id, 'delete')}
                        disabled={actionLoading === user.id + 'delete' || user.role === 'SUPER_ADMIN'}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">لا يوجد مدراء</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
