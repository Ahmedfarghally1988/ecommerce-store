"use client";

import React, { useState, useTransition } from 'react';
import {
  Mail, Send, Trash2, Search, CheckSquare, Square,
  Users, CheckCircle2, AlertCircle, Copy, Check,
  Sparkles, RefreshCw, X, Eye, FileText
} from 'lucide-react';
import { useToast } from '@/components/shared/ui/Toast';
import {
  deleteNewsletterSubscriber,
  deleteMultipleNewsletterSubscribers,
  sendNewsletterEmail,
  getNewsletterSubscribers
} from '@/app/actions/admin/newsletter';

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: Date | string;
}

interface NewsletterClientProps {
  initialSubscribers: Subscriber[];
  totalCount: number;
  activeCount: number;
}

export default function NewsletterClient({
  initialSubscribers = [],
  totalCount = 0,
  activeCount = 0,
}: NewsletterClientProps) {
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Send Email Modal State
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [recipientType, setRecipientType] = useState<'all' | 'selected'>('all');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Filter subscribers
  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const isAllSelected =
    filteredSubscribers.length > 0 &&
    filteredSubscribers.every((s) => selectedIds.includes(s.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      // Unselect all visible
      const visibleIds = new Set(filteredSubscribers.map((s) => s.id));
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      // Select all visible
      const visibleIds = filteredSubscribers.map((s) => s.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
    addToast({
      title: 'تم النسخ',
      message: 'تم نسخ البريد الإلكتروني للحافظة',
      type: 'success',
    });
  };

  const handleDeleteSingle = async (id: string, email: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف المشترك: ${email}؟`)) return;

    startTransition(async () => {
      try {
        const res = await deleteNewsletterSubscriber(id);
        if (res.success) {
          setSubscribers((prev) => prev.filter((s) => s.id !== id));
          setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
          addToast({
            title: 'تم الحذف',
            message: 'تم حذف المشترك بنجاح',
            type: 'success',
          });
        }
      } catch (e: any) {
        addToast({
          title: 'خطأ',
          message: e.message || 'حدث خطأ أثناء الحذف',
          type: 'error',
        });
      }
    });
  };

  const handleDeleteMultiple = async () => {
    if (selectedIds.length === 0) return;
    if (
      !confirm(
        `هل أنت متأكد من حذف ${selectedIds.length} من المشتركين المحددين نهائياً؟`
      )
    )
      return;

    startTransition(async () => {
      try {
        const res = await deleteMultipleNewsletterSubscribers(selectedIds);
        if (res.success) {
          setSubscribers((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
          setSelectedIds([]);
          addToast({
            title: 'تم الحذف الجماعي',
            message: `تم حذف ${res.count} مشترك بنجاح`,
            type: 'success',
          });
        }
      } catch (e: any) {
        addToast({
          title: 'خطأ',
          message: e.message || 'حدث خطأ أثناء الحذف الجماعي',
          type: 'error',
        });
      }
    });
  };

  const openSendModal = (target: 'all' | 'selected' = 'all') => {
    if (target === 'selected' && selectedIds.length === 0) {
      addToast({
        title: 'تنبيه',
        message: 'يرجى تحديد مشترك واحد على الأقل عبر مربعات الاختيار أولاً',
        type: 'warning',
      });
      return;
    }
    setRecipientType(target);
    setIsSendModalOpen(true);
  };

  const handleSendEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim()) {
      addToast({ title: 'تنبيه', message: 'يرجى كتابة عنوان الرسالة', type: 'warning' });
      return;
    }
    if (!emailContent.trim()) {
      addToast({ title: 'تنبيه', message: 'يرجى كتابة محتوى الرسالة', type: 'warning' });
      return;
    }

    setIsSending(true);
    try {
      const res = await sendNewsletterEmail({
        subject: emailSubject,
        content: emailContent,
        recipientType,
        selectedIds: recipientType === 'selected' ? selectedIds : [],
      });

      setIsSending(false);

      if (res.success) {
        setIsSendModalOpen(false);
        setEmailSubject('');
        setEmailContent('');
        addToast({
          title: 'نجاح الإرسال 🎉',
          message: res.message || 'تم إرسال الرسالة للمشتركين بنجاح',
          type: 'success',
        });
      } else {
        addToast({
          title: 'تعذر الإرسال',
          message: res.error || 'حدث خطأ أثناء الإرسال',
          type: 'error',
        });
      }
    } catch (err: any) {
      setIsSending(false);
      addToast({
        title: 'خطأ غير متوقع',
        message: err.message || 'حدث خطأ غير متوقع',
        type: 'error',
      });
    }
  };

  const handleRefresh = async () => {
    startTransition(async () => {
      try {
        const data = await getNewsletterSubscribers(searchQuery);
        setSubscribers(data.subscribers);
        addToast({
          title: 'تم التحديث',
          message: 'تم تحديث قائمة المشتركين',
          type: 'success',
        });
      } catch (e) {}
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                مشتركو النشرة البريدية
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                إدارة المشتركين وإرسال حملات البريد الإلكتروني للجميع أو للمحددين
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={isPending}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 hover:text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
          </button>

          {/* Delete Selected Button */}
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteMultiple}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف المحدد ({selectedIds.length})</span>
            </button>
          )}

          {/* Send to Selected Button */}
          {selectedIds.length > 0 && (
            <button
              onClick={() => openSendModal('selected')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              <span>مراسلة المحدد ({selectedIds.length})</span>
            </button>
          )}

          {/* Send to All Button */}
          <button
            onClick={() => openSendModal('all')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <Send className="w-4 h-4" />
            <span>إرسال بريد للجميع ({subscribers.length})</span>
          </button>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">إجمالي المشتركين</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
              {subscribers.length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">المشتركون النشطون</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {subscribers.filter((s) => s.isActive).length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">المحددون حالياً</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">
              {selectedIds.length}
            </p>
          </div>
        </div>
      </div>

      {/* ── Search & Filters ── */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="بحث بالبريد الإلكتروني..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-10 pe-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 transition-all"
          />
        </div>

        {selectedIds.length > 0 && (
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <span>تم تحديد {selectedIds.length} من أصل {filteredSubscribers.length}</span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-blue-600 hover:underline text-xs"
            >
              إلغاء التحديد
            </button>
          </div>
        )}
      </div>

      {/* ── Subscribers Table ── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 border-b border-gray-200 border-gray-100 dark:border-gray-700">
              <tr>
                <th className="p-4 w-12 text-center">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">البريد الإلكتروني</th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">تاريخ الاشتراك</th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">الحالة</th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300 text-center w-36">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold text-sm">لا يوجد مشتركون مطابقون للبحث</p>
                    <p className="text-xs text-gray-400 mt-1">
                      عند اشتراك أي عميل من النشرة البريدية بالفوتر، سيظهر بريده هنا تلقائياً
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => {
                  const isSelected = selectedIds.includes(subscriber.id);
                  return (
                    <tr
                      key={subscriber.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors ${
                        isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(subscriber.id)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Email with copy button */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-gray-900 dark:text-gray-100" dir="ltr">
                            {subscriber.email}
                          </span>
                          <button
                            onClick={() => handleCopyEmail(subscriber.email)}
                            className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                            title="نسخ البريد"
                          >
                            {copiedEmail === subscriber.email ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="p-4 text-gray-500 dark:text-gray-400">
                        {new Date(subscriber.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          نشط
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedIds([subscriber.id]);
                              openSendModal('selected');
                            }}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="إرسال رسالة لهذا المشترك"
                          >
                            <Send className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteSingle(subscriber.id, subscriber.email)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="حذف المشترك"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* ═══════════════════════════════════════════════════════
          SEND EMAIL MODAL (جميع المشتركين أو المحددين فقط)
      ═══════════════════════════════════════════════════════ */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/70 dark:bg-gray-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    إرسال رسالة بريدية جديدة
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    أرسل عروضاً أو إعلانات لمشتركي النشرة البريدية
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSendModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-400 hover:text-gray-700 dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendEmailSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Recipient Selector Tabs */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  الجمهور المستهدف بالإرسال:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRecipientType('all')}
                    className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                      recipientType === 'all'
                        ? 'border-b border-gray-200lue-600 bg-blue-50/50 dark:bg-blue-900/20 ring-2 ring-blue-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">
                        جميع المشتركين
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        إرسال لكافة القائمة البريدية
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
                      {subscribers.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedIds.length === 0) {
                        addToast({
                          title: 'تنبيه',
                          message: 'لم تقم بتحديد أي مشتركين من الجدول بعد!',
                          type: 'warning',
                        });
                        return;
                      }
                      setRecipientType('selected');
                    }}
                    className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                      recipientType === 'selected'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 ring-2 ring-indigo-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">
                        المشتركون المحددون فقط
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        المختارون عبر مربعات الاختيار
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      selectedIds.length > 0 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {selectedIds.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Subject Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  عنوان الرسالة (Subject) *
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="مثال: خصم 20% حصري لمشتركينا بمناسبة نهاية الأسبوع! 🔥"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-medium"
                />
              </div>

              {/* Content / Body Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                    محتوى الرسالة *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isPreviewMode ? 'العودة للتحرير' : 'معاينة القالب'}</span>
                  </button>
                </div>

                {isPreviewMode ? (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl min-h-[180px] max-h-[260px] overflow-y-auto text-xs leading-relaxed space-y-2">
                    <p className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-200 pb-2">
                      {emailSubject || '(بدون عنوان)'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {emailContent || '(لا يوجد محتوى مكتوب بعد)'}
                    </p>
                  </div>
                ) : (
                  <textarea
                    rows={7}
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    placeholder="اكتب تفاصيل الرسالة والعرض الترويجي هنا..."
                    required
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none leading-relaxed"
                  />
                )}
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-b border-gray-200lue-100 dark:border-b border-gray-200lue-900 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                <p className="leading-relaxed">
                  سيتم إرسال الرسالة باستخدام قالب احترافي يحمل اسم المتجر مع إرسال مخفي (BCC) لحماية خصوصية بيانات المشتركين.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsSendModalOpen(false)}
                  disabled={isSending}
                  className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-60"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        إرسال الآن (
                        {recipientType === 'all'
                          ? `لكافة المشتركين: ${subscribers.length}`
                          : `للمحددين: ${selectedIds.length}`}
                        )
                      </span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
