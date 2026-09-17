'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Country, Currency } from '@prisma/client';

export default function CountrySelector({
  countries,
  currentCountryCode,
  locale,
}: {
  countries: (Country & { currency: Currency })[];
  currentCountryCode: string;
  locale: string;
}) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountryChange = (selectedCode: string) => {
    const selectedCountry = countries.find(c => c.code === selectedCode);
    
    if (selectedCountry) {
      document.cookie = `USER_COUNTRY=${selectedCode}; path=/; max-age=31536000; SameSite=Lax`;
      if (selectedCountry.currency) {
        document.cookie = `USER_CURRENCY=${selectedCountry.currency.code}; path=/; max-age=31536000; SameSite=Lax`;
      }
      setIsOpen(false);
      router.refresh();
    }
  };

  const selectedCountry = countries.find(c => c.code === currentCountryCode);

  if (countries.length === 0) return null;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium">
          {selectedCountry 
            ? (locale === 'ar' ? selectedCountry.nameAr : selectedCountry.nameEn)
            : (locale === 'ar' ? 'اختر البلد' : 'Select Country')}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className={`absolute z-50 mt-2 w-48 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden transform transition-all duration-200 ease-out origin-top-right ${locale === 'ar' ? 'left-0 origin-top-left' : 'right-0'}`}
        >
          <div className="py-2" role="menu" aria-orientation="vertical">
            {countries.map((country) => (
              <button
                key={country.id}
                onClick={() => handleCountryChange(country.code)}
                className={`w-full text-start px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 flex items-center justify-between ${
                  currentCountryCode === country.code ? 'bg-gray-50 font-semibold text-black' : 'text-gray-700'
                }`}
                role="menuitem"
              >
                <span>{locale === 'ar' ? country.nameAr : country.nameEn}</span>
                {currentCountryCode === country.code && (
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
