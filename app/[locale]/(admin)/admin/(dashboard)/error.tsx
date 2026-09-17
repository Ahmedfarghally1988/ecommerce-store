"use client";

import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl text-red-600 dark:text-red-400">⚠️</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        حدث خطأ
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 w-full">
        {error.message || 'عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.'}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          المحاولة مرة أخرى
        </button>
        <Link
          href="/admin"
          className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
