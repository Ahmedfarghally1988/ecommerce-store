"use client";

import { useState } from 'react';
import { Check, X, Trash2, Star, Eye } from 'lucide-react';
import { Button } from '@/components/shared/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/Table';
import { useToast } from '@/components/shared/ui/Toast';
import { Modal } from '@/components/shared/ui/Modal';
import { toggleReviewStatus, deleteReview } from '@/app/actions/admin/reviews';

export function ReviewsClient({ reviews: initialReviews }: { reviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const { showToast } = useToast();

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleReviewStatus(id, !currentStatus);
      setReviews(reviews.map(r => r.id === id ? { ...r, isApproved: !currentStatus } : r));
      showToast('تم تحديث حالة التقييم', 'success');
      
      // Update selected review if modal is open
      if (selectedReview && selectedReview.id === id) {
        setSelectedReview({ ...selectedReview, isApproved: !currentStatus });
      }
    } catch (error) {
      showToast('فشل تحديث الحالة', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    
    try {
      await deleteReview(id);
      setReviews(reviews.filter(r => r.id !== id));
      showToast('تم حذف التقييم بنجاح', 'success');
      
      if (selectedReview && selectedReview.id === id) {
        setSelectedReview(null);
      }
    } catch (error) {
      showToast('فشل حذف التقييم', 'error');
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'pending') return !r.isApproved;
    if (filter === 'approved') return r.isApproved;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">التقييمات</h1>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-white text-black shadow' : 'text-gray-500 hover:text-gray-900'}`}
          >
            الكل
          </button>
          <button 
            onClick={() => setFilter('pending')} 
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'pending' ? 'bg-white text-black shadow' : 'text-gray-500 hover:text-gray-900'}`}
          >
            بانتظار الموافقة
          </button>
          <button 
            onClick={() => setFilter('approved')} 
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'approved' ? 'bg-white text-black shadow' : 'text-gray-500 hover:text-gray-900'}`}
          >
            مقبولة
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المنتج</TableHead>
            <TableHead>العميل</TableHead>
            <TableHead>التقييم</TableHead>
            <TableHead>التعليق</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-right rtl:text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                لا توجد تقييمات مطابقة.
              </TableCell>
            </TableRow>
          ) : (
            filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium text-sm">
                  {review.product.nameAr}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{review.user.name}</div>
                    {review.userReviewsOnProductCount > 1 && (
                      <span className="inline-flex items-center justify-center bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full" title={`علق على هذا المنتج ${review.userReviewsOnProductCount} مرات`}>
                        {review.userReviewsOnProductCount}x
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{review.user.email}</div>
                </TableCell>
                <TableCell>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs text-sm">
                  {review.comment ? (
                    <p className="truncate" title={review.comment}>{review.comment}</p>
                  ) : (
                    <span className="text-gray-400 italic">لا يوجد تعليق</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {review.isApproved ? 'مقبول' : 'قيد المراجعة'}
                  </span>
                </TableCell>
                <TableCell className="text-right rtl:text-left">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-blue-500"
                      title="عرض التفاصيل"
                      onClick={() => setSelectedReview(review)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={review.isApproved ? "text-amber-500" : "text-green-600"}
                      title={review.isApproved ? "إلغاء القبول" : "قبول"}
                      onClick={() => handleToggleStatus(review.id, review.isApproved)}
                    >
                      {review.isApproved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(review.id)} title="حذف">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        title="تفاصيل التقييم"
        maxWidth="max-w-lg"
      >
        {selectedReview && (
          <div className="space-y-6 mt-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">المنتج</p>
              <p className="font-semibold text-gray-900">{selectedReview.product.nameAr}</p>
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">العميل</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{selectedReview.user.name}</p>
                  {selectedReview.userReviewsOnProductCount > 1 && (
                    <span className="inline-flex items-center justify-center bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full border border-red-200">
                      قام بالتعليق {selectedReview.userReviewsOnProductCount} مرات
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{selectedReview.user.email}</p>
              </div>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-5 h-5 ${star <= selectedReview.rating ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">نص التعليق</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-800 whitespace-pre-wrap text-sm leading-relaxed min-h-[100px]">
                {selectedReview.comment || <span className="text-gray-400 italic">لا يوجد تعليق نصي</span>}
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${selectedReview.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {selectedReview.isApproved ? 'حالة التعليق: مقبول ✔' : 'حالة التعليق: قيد المراجعة ⏳'}
              </span>
              
              <div className="flex gap-2">
                <Button 
                  variant={selectedReview.isApproved ? "outline" : "primary"}
                  onClick={() => handleToggleStatus(selectedReview.id, selectedReview.isApproved)}
                >
                  {selectedReview.isApproved ? 'إلغاء الموافقة' : 'موافقة على التعليق'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
