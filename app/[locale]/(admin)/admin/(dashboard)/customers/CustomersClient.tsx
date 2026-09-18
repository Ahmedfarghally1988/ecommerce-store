"use client";

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { approveCustomer, rejectCustomer, suspendCustomer, activateCustomer, deleteCustomer } from '@/app/actions/admin/customers';
import { UserCheck, UserX, UserMinus, UserPlus, Search, Clock, CheckCircle, Ban, AlertCircle, Trash2 } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  phone?: string | null;
  customerStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  status: boolean;
  createdAt: string;
  _count: { orders: number };
}

interface CustomersClientProps {
  initialCustomers: Customer[];
  pendingCount: number;
}

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', labelAr: 'قيد الانتظار', color: 'bg-amber-100 text-amber-700', icon: Clock },
  APPROVED: { label: 'Approved', labelAr: 'موافق عليه', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  REJECTED: { label: 'Rejected', labelAr: 'مرفوض', color: 'bg-red-100 text-red-700', icon: Ban },
  SUSPENDED: { label: 'Suspended', labelAr: 'موقوف', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
};

type Filter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export default function CustomersClient({ initialCustomers, pendingCount }: CustomersClientProps) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filtered = customers.filter((c) => {
    const matchesFilter = filter === 'ALL' || c.customerStatus === filter;
    const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'suspend' | 'activate' | 'delete') => {
    if (action === 'delete') {
      if (!window.confirm('هل أنت متأكد من حذف هذا العميل نهائياً؟ ستُحذف عناوينه وتقييماته للأبد، لكن سيتم الاحتفاظ بالطلبات السابقة كسجلات غير مرتبطة.')) {
        return;
      }
    }
    setActionLoading(id + action);
    try {
      const actionFn = action === 'approve' ? approveCustomer
        : action === 'reject' ? rejectCustomer
        : action === 'suspend' ? suspendCustomer
        : action === 'activate' ? activateCustomer
        : deleteCustomer;

      await actionFn(id);

      if (action === 'delete') {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
      } else {
        setCustomers((prev) => prev.map((c) => {
          if (c.id !== id) return c;
          const newStatus = action === 'approve' || action === 'activate' ? 'APPROVED'
            : action === 'reject' ? 'REJECTED'
            : 'SUSPENDED';
          return { ...c, customerStatus: newStatus as Customer['customerStatus'] };
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const tabs: { key: Filter; labelAr: string }[] = [
    { key: 'ALL', labelAr: 'الكل' },
    { key: 'PENDING', labelAr: `معلق (${pendingCount})` },
    { key: 'APPROVED', labelAr: 'مقبول' },
    { key: 'REJECTED', labelAr: 'مرفوض' },
    { key: 'SUSPENDED', labelAr: 'موقوف' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">العملاء</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">إدارة تسجيلات العملاء والموافقة عليها</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-2 rounded-xl border border-amber-200 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {pendingCount} بانتظار الموافقة
          </div>
        )}
      </div>

      {/* Filter Tabs + Search */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-0 overflow-hidden p-4 md:p-6">
        <div className="flex items-center gap-1 pb-4 mb-4 border-b border-gray-200 border-gray-100 dark:border-gray-800 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tab.labelAr}
            </button>
          ))}
          <div className="flex-1" />
          <div className="relative px-2">
            <Search className="absolute left-5 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو البريد..."
              className="pr-9 pl-4 py-2 border border-gray-100 dark:border-gray-800 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl bg-white dark:bg-gray-900/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 border-gray-100/50 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50">
                <th className="text-right px-6 py-4 font-semibold text-xs tracking-wider uppercase text-gray-500 dark:text-gray-400 w-16">#</th>
                <th className="text-right px-6 py-4 font-semibold text-xs tracking-wider uppercase text-gray-500 dark:text-gray-400">العميل</th>
                <th className="text-right px-6 py-4 font-semibold text-xs tracking-wider uppercase text-gray-500 dark:text-gray-400">الهاتف</th>
                <th className="text-right px-6 py-4 font-semibold text-xs tracking-wider uppercase text-gray-500 dark:text-gray-400">تاريخ الانضمام</th>
                <th className="text-right px-6 py-4 font-semibold text-xs tracking-wider uppercase text-gray-500 dark:text-gray-400">الطلبات</th>
                <th className="text-right px-6 py-4 font-semibold text-xs tracking-wider uppercase text-gray-500 dark:text-gray-400">الحالة</th>
                <th className="text-right px-6 py-4 font-semibold text-xs tracking-wider uppercase text-gray-500 dark:text-gray-400">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    لا يوجد عملاء مطابقين.
                  </td>
                </tr>
              ) : (
                filtered.map((customer, index) => {
                  const statusCfg = STATUS_CONFIG[customer.customerStatus];
                  const StatusIcon = statusCfg.icon;
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-900 dark:text-gray-100">{index + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {customer.avatar ? (
                            <img src={customer.avatar} alt={customer.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {customer.name?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{customer.name}</p>
                            <p className="text-gray-500 text-xs">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{customer.phone || '—'}</td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                        {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                        <Link href={`/${locale}/admin/orders?userId=${customer.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {customer._count.orders}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusCfg.labelAr}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {customer.customerStatus === 'PENDING' && (
                            <>
                              <ActionButton
                                onClick={() => handleAction(customer.id, 'approve')}
                                loading={actionLoading === customer.id + 'approve'}
                                color="green"
                                icon={<UserCheck className="w-3.5 h-3.5" />}
                                label="قبول"
                              />
                              <ActionButton
                                onClick={() => handleAction(customer.id, 'reject')}
                                loading={actionLoading === customer.id + 'reject'}
                                color="red"
                                icon={<UserX className="w-3.5 h-3.5" />}
                                label="رفض"
                              />
                            </>
                          )}
                          {customer.customerStatus === 'APPROVED' && (
                            <ActionButton
                              onClick={() => handleAction(customer.id, 'suspend')}
                              loading={actionLoading === customer.id + 'suspend'}
                              color="orange"
                              icon={<UserMinus className="w-3.5 h-3.5" />}
                              label="إيقاف"
                            />
                          )}
                          {(customer.customerStatus === 'REJECTED' || customer.customerStatus === 'SUSPENDED') && (
                            <ActionButton
                              onClick={() => handleAction(customer.id, 'activate')}
                              loading={actionLoading === customer.id + 'activate'}
                              color="blue"
                              icon={<UserPlus className="w-3.5 h-3.5" />}
                              label="تفعيل"
                            />
                          )}
                          <Link href={`/${locale}/admin/customers/${customer.id}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
                            تعديل
                          </Link>
                          <ActionButton
                            onClick={() => handleAction(customer.id, 'delete')}
                            loading={actionLoading === customer.id + 'delete'}
                            color="red"
                            icon={<Trash2 className="w-3.5 h-3.5" />}
                            label="حذف"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  onClick, loading, color, icon, label,
}: {
  onClick: () => void; loading: boolean; color: 'green' | 'red' | 'orange' | 'blue'; icon: React.ReactNode; label: string;
}) {
  const colors = {
    green: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200',
    red: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200',
    orange: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200',
    blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-b border-gray-200lue-200',
  };
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors disabled:opacity-50 ${colors[color]}`}
    >
      {loading ? <span className="animate-spin">⟳</span> : icon}
      {label}
    </button>
  );
}
