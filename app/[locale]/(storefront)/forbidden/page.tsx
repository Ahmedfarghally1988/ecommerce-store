import Link from 'next/link';
import { Button } from '@/components/shared/ui/Button';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center dark:bg-gray-950 px-4">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-50">403</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">Access Forbidden</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        You do not have permission to access this page.
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    </div>
  );
}
