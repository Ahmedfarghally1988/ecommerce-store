'use client';

import { useRouter } from 'next/navigation';
import { Currency } from '@prisma/client';

export default function CurrencySelector({
  currencies,
  currentCurrency,
}: {
  currencies: Currency[];
  currentCurrency: string;
}) {
  const router = useRouter();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    document.cookie = `USER_CURRENCY=${selectedCode}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh(); // refresh the current route to fetch with new currency
  };

  if (currencies.length <= 1) return null; // Don't show if only 1 currency

  return (
    <div className="flex items-center">
      <select
        value={currentCurrency}
        onChange={handleCurrencyChange}
        className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer border-none p-1"
        aria-label="Select Currency"
      >
        {currencies.map((curr) => (
          <option key={curr.id} value={curr.code} className="text-black">
            {curr.code}
          </option>
        ))}
      </select>
    </div>
  );
}
