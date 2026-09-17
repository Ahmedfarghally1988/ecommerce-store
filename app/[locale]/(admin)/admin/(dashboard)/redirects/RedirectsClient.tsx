"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect } from '@prisma/client';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/shared/ui/Button';
import { Input } from '@/components/shared/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/Table';
import { Modal } from '@/components/shared/ui/Modal';
import { useToast } from '@/components/shared/ui/Toast';
import { redirectSchema, RedirectInput } from '@/lib/validations/admin';
import { createRedirect, updateRedirect, deleteRedirect } from '@/app/actions/admin/redirects';

export function RedirectsClient({ redirects }: { redirects: Redirect[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null);
  const { showToast } = useToast();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RedirectInput>({
    resolver: zodResolver(redirectSchema),
    defaultValues: {
      isPermanent: true,
    }
  });

  const openModal = (redirect?: Redirect) => {
    if (redirect) {
      setEditingRedirect(redirect);
      reset({
        source: redirect.source,
        destination: redirect.destination,
        isPermanent: redirect.isPermanent,
      });
    } else {
      setEditingRedirect(null);
      reset({ source: '', destination: '', isPermanent: true });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: RedirectInput) => {
    try {
      if (editingRedirect) {
        await updateRedirect(editingRedirect.id, data);
        showToast('تم التحديث بنجاح', 'success');
      } else {
        await createRedirect(data);
        showToast('تم الإنشاء بنجاح', 'success');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      showToast(error.message || 'حدث خطأ ما', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من الحذف؟')) {
      try {
        await deleteRedirect(id);
        showToast('تم الحذف بنجاح', 'success');
      } catch (error: any) {
        showToast('فشل الحذف', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">تحويل الروابط (Redirects)</h1>
        <Button onClick={() => openModal()}>
          <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
          إضافة تحويل
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>الرابط القديم</TableHead>
            <TableHead>الرابط الجديد</TableHead>
            <TableHead>النوع</TableHead>
            <TableHead className="text-right rtl:text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {redirects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                لا توجد روابط للتحويل.
              </TableCell>
            </TableRow>
          ) : (
            redirects.map((redirect, index) => (
              <TableRow key={redirect.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium text-red-500" dir="ltr">{redirect.source}</TableCell>
                <TableCell className="text-green-500" dir="ltr">{redirect.destination}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${redirect.isPermanent ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                    {redirect.isPermanent ? '301 Permanent' : '302 Temporary'}
                  </span>
                </TableCell>
                <TableCell className="text-right rtl:text-left">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openModal(redirect)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(redirect.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingRedirect ? 'تعديل تحويل' : 'تحويل جديد'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" dir="ltr">
          <Input label="Source Path (e.g. /old-page)" {...register('source')} error={errors.source?.message} placeholder="/old-page" />
          <Input label="Destination Path (e.g. /new-page)" {...register('destination')} error={errors.destination?.message} placeholder="/new-page" />
          
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isPermanent" {...register('isPermanent')} className="h-4 w-4 rounded border-gray-300" />
            <label htmlFor="isPermanent" className="text-sm font-medium">Permanent (301)</label>
          </div>

          <div className="pt-4 flex justify-end gap-2" dir="rtl">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
            <Button type="submit" isLoading={isSubmitting}>حفظ</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
