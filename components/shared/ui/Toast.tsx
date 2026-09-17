"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  title?: string;
  message: string;
  type?: ToastType;
}

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  addToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(({ title, message, type = 'info' }: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    addToast({ message, type });
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, addToast }}>
      {children}
      <div className="fixed bottom-4 end-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-4 sm:p-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border text-sm font-medium transition-all animate-in slide-in-from-bottom-5 ${
              toast.type === 'success'
                ? 'bg-white border-emerald-200 text-emerald-950 dark:bg-gray-900 dark:border-emerald-800 dark:text-emerald-100 shadow-emerald-500/10'
                : toast.type === 'error'
                ? 'bg-white border-red-200 text-red-950 dark:bg-gray-900 dark:border-red-800 dark:text-red-100 shadow-red-500/10'
                : toast.type === 'warning'
                ? 'bg-white border-amber-200 text-amber-950 dark:bg-gray-900 dark:border-amber-800 dark:text-amber-100 shadow-amber-500/10'
                : 'bg-white border-b border-gray-200lue-200 text-blue-950 dark:bg-gray-900 dark:border-b border-gray-200lue-800 dark:text-blue-100 shadow-blue-500/10'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
            </div>

            <div className="flex-1 min-w-0">
              {toast.title && <h5 className="font-bold text-xs mb-0.5">{toast.title}</h5>}
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-60 hover:opacity-100 text-gray-500 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
