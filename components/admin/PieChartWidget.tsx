'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DataItem {
  name: string;
  value: number;
}

interface PieChartWidgetProps {
  title: string;
  data: DataItem[];
  currency?: string;
  isCurrency?: boolean;
  layout?: 'horizontal' | 'vertical';
}

// A vibrant, modern color palette for the pie charts
const COLORS = [
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f43f5e', // rose-500
  '#6366f1', // indigo-500
  '#84cc16', // lime-500
  '#0ea5e9'  // sky-500
];

const renderCustomTooltip = ({ active, payload, label }: any, isCurrency: boolean, currency: string) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const valueStr = isCurrency
      ? new Intl.NumberFormat('ar-EG', { style: 'currency', currency: currency || 'EGP' }).format(data.value)
      : data.value;

    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 z-50">
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">{data.name}</p>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.fill }}></span>
          <span>{valueStr}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function PieChartWidget({ title, data, currency = 'EGP', isCurrency = true, layout = 'horizontal' }: PieChartWidgetProps) {
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 flex flex-row items-center justify-center ${layout === 'vertical' ? 'h-full min-h-[350px]' : 'h-[160px]'}`}>
        <div className="text-gray-400 text-sm">
          لا توجد بيانات متاحة لـ: {title}
        </div>
      </div>
    );
  }

  const total = data.reduce((acc, entry) => acc + entry.value, 0);

  if (layout === 'vertical') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 flex flex-col h-full">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-4 text-center">{title}</h3>
        
        {/* Pie Chart */}
        <div className="w-full flex-1 min-h-[200px] max-h-[300px] mb-6 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={(props) => renderCustomTooltip(props, isCurrency, currency)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {data.map((entry, index) => {
            const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0.0';
            return (
              <div key={`item-${index}`} className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="text-gray-600 dark:text-gray-300 truncate" title={entry.value.toString()}>{entry.name}</span>
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-medium shrink-0 mr-1" dir="ltr">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 flex items-center gap-4 h-[160px]">
      {/* Title & Legend */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 shrink-0">{title}</h3>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          <ul className="flex flex-col gap-2">
            {data.map((entry, index) => {
              const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0.0';
              return (
                <li key={`item-${index}`} className="flex items-center justify-between text-[11px] sm:text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-gray-600 dark:text-gray-300 truncate" title={entry.value.toString()}>{entry.name}</span>
                  </div>
                  <span className="text-gray-900 dark:text-gray-100 font-medium shrink-0 mr-2" dir="ltr">{percentage}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="w-[100px] h-[100px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={45}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={(props) => renderCustomTooltip(props, isCurrency, currency)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
