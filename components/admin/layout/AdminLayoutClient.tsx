"use client";

import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  pendingCustomers: number;
  adminPermissions: string[];
  adminRole: string;
  adminName: string;
  adminEmail: string;
  adminAvatar: string | null;
}

export function AdminLayoutClient({
  children,
  pendingCustomers,
  adminPermissions,
  adminRole,
  adminName,
  adminEmail,
  adminAvatar,
}: AdminLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-gray-50 dark:bg-gray-900 print:h-auto print:overflow-visible print:bg-white print:block">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0 print:hidden">
        <AdminSidebar
          pendingCustomers={pendingCustomers}
          adminPermissions={adminPermissions}
          adminRole={adminRole}
        />
      </div>

      {/* Sidebar for mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-gray-900">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">إغلاق القائمة</span>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AdminSidebar
              pendingCustomers={pendingCustomers}
              adminPermissions={adminPermissions}
              adminRole={adminRole}
              onMobileClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden w-full print:overflow-visible print:block">
        <div className="print:hidden">
          <AdminHeader 
            adminName={adminName} 
            adminEmail={adminEmail} 
            adminAvatar={adminAvatar} 
            onMenuClick={() => setMobileMenuOpen(true)}
          />
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative print:overflow-visible print:p-0">
          {children}
        </main>
      </div>
    </div>
  );
}
