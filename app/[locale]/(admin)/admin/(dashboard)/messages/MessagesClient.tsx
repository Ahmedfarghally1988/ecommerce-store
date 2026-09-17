"use client";

import { useState } from 'react';
import { ContactMessage } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/Table';
import { useToast } from '@/components/shared/ui/Toast';
import { markMessageAsRead, deleteMessage } from '@/app/actions/admin/messages';
import { Trash2, Eye, Mail, MailOpen } from 'lucide-react';
import { Modal } from '@/components/shared/ui/Modal';

export function MessagesClient({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const { showToast } = useToast();
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const handleRead = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      try {
        await markMessageAsRead(msg.id);
        setMessages(messages.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
      } catch (error) {}
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    try {
      const res = await deleteMessage(id);
      if (res.success) {
        setMessages(messages.filter(m => m.id !== id));
        showToast('تم حذف الرسالة', 'success');
        if (selectedMessage?.id === id) setSelectedMessage(null);
      } else {
        showToast('فشل حذف الرسالة', 'error');
      }
    } catch (error) {
      showToast('خطأ أثناء الحذف', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">الرسائل والاستفسارات</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">رسائل الزوار من صفحة اتصل بنا</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">الحالة</TableHead>
            <TableHead>الاسم</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>الموضوع</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead className="text-right rtl:text-left">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                لا توجد رسائل.
              </TableCell>
            </TableRow>
          ) : (
            messages.map((msg) => (
              <TableRow key={msg.id} className={msg.isRead ? 'opacity-70' : 'font-semibold bg-blue-50/30 dark:bg-blue-900/10'}>
                <TableCell>
                  {msg.isRead ? <MailOpen className="w-5 h-5 text-gray-400" /> : <Mail className="w-5 h-5 text-blue-500" />}
                </TableCell>
                <TableCell>{msg.name}</TableCell>
                <TableCell><span dir="ltr">{msg.email}</span></TableCell>
                <TableCell>{msg.subject}</TableCell>
                <TableCell className="text-sm">
                  {new Date(msg.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                </TableCell>
                <TableCell className="text-right rtl:text-left space-x-2 space-x-reverse">
                  <button 
                    onClick={() => handleRead(msg)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors inline-flex"
                    title="قراءة الرسالة"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors inline-flex"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal isOpen={!!selectedMessage} onClose={() => setSelectedMessage(null)} title="تفاصيل الرسالة">
        {selectedMessage && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">اسم المرسل</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedMessage.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">البريد الإلكتروني</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100"><span dir="ltr">{selectedMessage.email}</span></p>
              </div>
              <div>
                <p className="text-xs text-gray-500">رقم الهاتف</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100"><span dir="ltr">{selectedMessage.phone || '—'}</span></p>
              </div>
              <div>
                <p className="text-xs text-gray-500">التاريخ</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(selectedMessage.createdAt).toLocaleString('ar-EG')}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">الموضوع</p>
              <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{selectedMessage.subject}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">نص الرسالة</p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                إغلاق
              </button>
              <a
                href={`mailto:${selectedMessage.email}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                رد عبر الإيميل
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
