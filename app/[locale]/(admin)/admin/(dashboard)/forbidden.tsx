import Link from 'next/link';

export default function Forbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4 w-full  p-8">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center ">
          <span className="text-4xl">🔒</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          403 — ليس لديك صلاحية
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          حسابك لا يملك الإذن للوصول إلى هذه الصفحة أو تنفيذ هذا الإجراء.<br />
          تواصل مع Super Admin لمنحك الصلاحيات اللازمة.
        </p>
        <Link
          href="/admin"
          className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold"
        >
          العودة إلى الرئيسية
        </Link>
      </div>
    </div>
  );
}
