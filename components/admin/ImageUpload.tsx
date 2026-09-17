"use client";

import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/shared/ui/Toast';

interface ImageUploadProps {
  value: string | string[]; // Single string for single mode, array of strings for multiple mode
  onChange: (value: any) => void;
  multiple?: boolean;
  label?: string;
  folder?: string;
}

export function ImageUpload({ value, onChange, multiple = false, label = "صورة", folder }: ImageUploadProps) {
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const images = multiple ? (value as string[]) : (value ? [value as string] : []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) {
        formData.append('folder', folder);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل الرفع');

      const url = data.url;

      if (multiple) {
        onChange([...images, url]);
      } else {
        onChange(url);
      }
      
      showToast('تم رفع الصورة بنجاح', 'success');
    } catch (error: any) {
      showToast(error.message || 'فشل رفع الصورة', 'error');
    } finally {
      setIsUploading(false);
      // Reset input value to allow uploading the same file again if removed
      e.target.value = '';
    }
  };

  const handleRemove = (indexToRemove: number) => {
    if (multiple) {
      const newImages = images.filter((_, idx) => idx !== indexToRemove);
      onChange(newImages);
    } else {
      onChange('');
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      
      <div className="flex flex-wrap gap-4">
        {/* Previews */}
        {images.map((url, idx) => (
          <div key={idx} className="relative group w-24 h-24 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800">
            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
            {multiple && idx === 0 && (
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-0.5">
                الرئيسية
              </div>
            )}
          </div>
        ))}

        {/* Upload Button */}
        {(!value || multiple) && (
          <label className={`cursor-pointer flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploading ? (
              <div className="animate-spin text-gray-400 mb-1">⟳</div>
            ) : (
              <Upload className="w-6 h-6 text-gray-400 mb-1" />
            )}
            <span className="text-xs font-medium text-gray-500">{isUploading ? 'جاري الرفع...' : 'رفع صورة'}</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
