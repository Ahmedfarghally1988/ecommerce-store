"use client";

import { useState } from 'react';
import { Button } from '@/components/shared/ui/Button';
import { useToast } from '@/components/shared/ui/Toast';
import { updateRobotsTxt } from '@/app/actions/admin/robots';

export function RobotsClient({ initialContent }: { initialContent: string }) {
  const [content, setContent] = useState(initialContent || "User-agent: *\nAllow: /\n");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateRobotsTxt(content);
      showToast('تم حفظ ملف robots.txt بنجاح', 'success');
    } catch (error: any) {
      showToast(error.message || 'حدث خطأ ما', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">ملف Robots.txt</h1>
        <Button onClick={handleSave} isLoading={isSubmitting}>
          حفظ التعديلات
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-sm text-gray-500 mb-4">
          قم بتعديل ملف robots.txt الخاص بمتجرك. هذا الملف يخبر محركات البحث بالصفحات المسموح والممنوع فهرستها.
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-96 p-4 font-mono text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
          dir="ltr"
          placeholder={"User-agent: *\nAllow: /"}
        />
      </div>
    </div>
  );
}
