"use client";

import { useState, useTransition, useMemo, useRef } from 'react';
import Image from 'next/image';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  LayoutGrid, 
  Table as TableIcon, 
  Eye, 
  Folder, 
  HardDrive, 
  FileText,
  ExternalLink,
  X,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { MediaItem, deleteMediaFile } from '@/app/actions/admin/media';
import { useRouter } from 'next/navigation';

interface MediaClientProps {
  initialFiles: MediaItem[];
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function MediaClient({ initialFiles }: MediaClientProps) {
  const router = useRouter();
  const [files, setFiles] = useState<MediaItem[]>(initialFiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MediaItem | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = async (url: string) => {
    try {
      const fullUrl = window.location.origin + url;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(url);
      showToast('تم نسخ الرابط المباشر إلى الحافظة بنجاح');
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      // Fallback
      setCopiedUrl(url);
      showToast('تم النسخ');
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

  // Distinct folders from files
  const folders = useMemo(() => {
    const set = new Set<string>();
    files.forEach(f => {
      if (f.folder) set.add(f.folder);
    });
    return Array.from(set);
  }, [files]);

  // Filtered files
  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            file.relativePath.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;
      return matchesSearch && matchesFolder;
    });
  }, [files, searchTerm, selectedFolder]);

  // Total size
  const totalSizeBytes = useMemo(() => {
    return files.reduce((acc, curr) => acc + (curr.size || 0), 0);
  }, [files]);

  // Upload handler
  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    const targetFolder = selectedFolder === 'all' ? 'media' : selectedFolder;

    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      setUploadProgressText(`جاري رفع ${i + 1} من ${selected.length}: ${file.name}`);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', targetFolder);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'فشل الرفع');

        successCount++;
      } catch (err: any) {
        console.error(err);
        failCount++;
      }
    }

    setIsUploading(false);
    setUploadProgressText('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (successCount > 0) {
      showToast(`تم رفع ${successCount} ملف بنجاح!`, 'success');
      startTransition(() => {
        router.refresh();
      });
    }
    if (failCount > 0) {
      showToast(`تعذر رفع ${failCount} ملف. يرجى التأكد من الصيغة والحجم.`, 'error');
    }
  };

  // Delete handler
  const confirmDelete = async () => {
    if (!deletingItem) return;
    const itemToDelete = deletingItem;
    setDeletingItem(null);

    try {
      await deleteMediaFile(itemToDelete.relativePath);
      setFiles(prev => prev.filter(f => f.id !== itemToDelete.id));
      if (previewItem?.id === itemToDelete.id) {
        setPreviewItem(null);
      }
      showToast('تم حذف الملف بنجاح', 'success');
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      showToast(err.message || 'فشل حذف الملف', 'error');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-5 left-5 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-medium animate-in fade-in slide-in-from-bottom-5 duration-200 ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-600 text-white' 
            : 'bg-rose-600 text-white'
        }`}>
          {toastMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border-0">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مكتبة الوسائط</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                استعراض، وإدارة، وحذف ملفات الصور المرفوعة ونسخ روابطها المباشرة
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUploadFiles} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{uploadProgressText || 'جاري الرفع...'}</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>رفع ملفات جديدة</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg border-0 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">إجمالي الملفات</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{files.length} ملف</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg border-0 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">المساحة المستخدمة</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{formatBytes(totalSizeBytes)}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg border-0 flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-xl">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">المجلدات النشطة</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{folders.length} مجلد</div>
          </div>
        </div>
      </div>

      {/* Filter and View Controls Toolbar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg border-0 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="بحث باسم الملف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Folders tabs & View Switch */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          {/* Folder pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setSelectedFolder('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedFolder === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              الكل ({files.length})
            </button>
            {folders.map((folder) => {
              const count = files.filter(f => f.folder === folder).length;
              return (
                <button
                  key={folder}
                  type="button"
                  onClick={() => setSelectedFolder(folder)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedFolder === folder
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {folder} ({count})
                </button>
              );
            })}
          </div>

          {/* Grid / Table View Switch */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="عرض كشبكة"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="عرض كجدول"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredFiles.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-12 rounded-2xl shadow-lg border-0 text-center">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">لا توجد وسائط</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            {searchTerm || selectedFolder !== 'all'
              ? 'لم يتم العثور على أي ملفات تطابق معايير البحث الحالية.'
              : 'لم يتم رفع أي ملفات وسائط حتى الآن. اضغط على زر "رفع ملفات جديدة" للبدء.'}
          </p>
          {(searchTerm || selectedFolder !== 'all') && (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setSelectedFolder('all'); }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              إعادة ضبط الفلترة
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredFiles.map((file, idx) => {
            const isCopied = copiedUrl === file.url;
            return (
              <div 
                key={file.id} 
                className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-0 overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Index badge */}
                <div className="absolute top-2 right-2 z-10 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  #{idx + 1}
                </div>

                {/* Thumbnail Container */}
                <div 
                  className="relative aspect-square w-full bg-gray-100 dark:bg-gray-800 cursor-pointer overflow-hidden"
                  onClick={() => setPreviewItem(file)}
                >
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPreviewItem(file); }}
                      title="معاينة"
                      className="p-2 bg-white/90 text-gray-800 hover:bg-white rounded-xl shadow transition-all hover:scale-110"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(file.url); }}
                      title="نسخ الرابط"
                      className="p-2 bg-white/90 text-blue-600 hover:bg-white rounded-xl shadow transition-all hover:scale-110"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setDeletingItem(file); }}
                      title="حذف"
                      className="p-2 bg-white/90 text-red-600 hover:bg-white rounded-xl shadow transition-all hover:scale-110"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <p 
                    className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate" 
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400">
                    <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-600 dark:text-gray-300">
                      {file.folder}
                    </span>
                    <span>{formatBytes(file.size)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-0 p-4 md:p-6 w-full overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 border-gray-100 dark:border-gray-800 text-gray-400 font-medium text-xs">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 w-20 text-center">المعاينة</th>
                  <th className="py-3 px-4">اسم الملف</th>
                  <th className="py-3 px-4">المجلد</th>
                  <th className="py-3 px-4">الحجم</th>
                  <th className="py-3 px-4">تاريخ الرفع</th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredFiles.map((file, index) => {
                  const isCopied = copiedUrl === file.url;
                  return (
                    <tr 
                      key={file.id} 
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-center text-xs font-medium text-gray-400">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div 
                          className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden mx-auto cursor-pointer border border-gray-200 dark:border-gray-700 flex items-center justify-center group"
                          onClick={() => setPreviewItem(file)}
                        >
                          <img 
                            src={file.url} 
                            alt={file.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 dark:text-white max-w-xs md:max-w-md truncate" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-400 font-mono dir-ltr text-right truncate">
                          {file.url}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {file.folder}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap text-xs">
                        {formatBytes(file.size)}
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                        {formatDate(file.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(file.url)}
                            title="نسخ الرابط"
                            className="p-2 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewItem(file)}
                            title="معاينة وتفاصيل"
                            className="p-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingItem(file)}
                            title="حذف الملف"
                            className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-200 border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white truncate max-w-md">
                معاينة: {previewItem.name}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Image Preview Container */}
              <div className="relative w-full max-h-[50vh] min-h-[260px] bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center p-2 mb-6">
                <img
                  src={previewItem.url}
                  alt={previewItem.name}
                  className="max-h-[48vh] max-w-full object-contain rounded-xl shadow-sm"
                />
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-xs mb-4">
                <div>
                  <span className="text-gray-400 block mb-1">المجلد:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{previewItem.folder}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">الحجم:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{formatBytes(previewItem.size)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">تاريخ الرفع:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{formatDate(previewItem.createdAt)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">المسار النسبي:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200 truncate block">{previewItem.url}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(previewItem.url)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow transition-all"
                  >
                    {copiedUrl === previewItem.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedUrl === previewItem.url ? 'تم النسخ!' : 'نسخ رابط الصورة'}</span>
                  </button>
                  <a
                    href={previewItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>فتح في تبويب جديد</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const item = previewItem;
                    setPreviewItem(null);
                    setDeletingItem(item);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl text-xs font-semibold transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف الصورة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">تأكيد حذف الملف</h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف الملف{' '}
              <span className="font-semibold text-gray-900 dark:text-white">"{deletingItem.name}"</span>؟
              لن تتمكن من استرجاع هذا الملف بعد الحذف.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
