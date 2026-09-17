"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesChartProps {
  data: {
    name: string;
    المبيعات: number;
  }[];
  currency: string;
}

export default function SalesChart({ data, currency }: SalesChartProps) {
  // Simple custom tooltip for better formatting
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-sm rounded-md text-sm">
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">{label}</p>
          <p className="text-blue-600 dark:text-blue-400 font-bold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
            }).format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[300px]" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => `${value}`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6', className: 'dark:fill-gray-800' }} />
          <Bar 
            dataKey="المبيعات" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]} 
            barSize={40}
            className="dark:fill-blue-500"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
