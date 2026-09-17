"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function PeriodSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get("period") || "all";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const period = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (period === "all") {
      params.delete("period");
    } else {
      params.set("period", period);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <select
      value={currentPeriod}
      onChange={handleChange}
      className="text-sm rounded-md border border-gray-300 bg-white px-3 py-1.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
    >
      <option value="all">كل الأوقات</option>
      <option value="today">اليوم</option>
      <option value="7days">آخر 7 أيام</option>
      <option value="30days">آخر 30 يوم</option>
      <option value="this_month">هذا الشهر</option>
    </select>
  );
}
