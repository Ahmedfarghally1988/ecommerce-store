import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  locale: string;
}

export default function Breadcrumb({ items, locale }: BreadcrumbProps) {
  const isAr = locale === 'ar';
  
  return (
    <nav className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-500 mb-6 bg-gray-50/80 rounded-md py-3 px-4 -mt-4 w-full" aria-label="Breadcrumb">
      <Link href={`/${locale}`} className="hover:text-blue-600 transition-colors">
        {isAr ? 'الرئيسية' : 'Home'}
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {isAr ? <ChevronLeft className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
            {isLast || !item.href ? (
              <span className="text-gray-900 font-semibold">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-blue-600 transition-colors line-clamp-1">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
