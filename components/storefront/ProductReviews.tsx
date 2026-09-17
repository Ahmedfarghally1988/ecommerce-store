"use client";

import React, { useState } from 'react';
import { Star, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/shared/ui/Button';
import { submitReview } from '@/app/actions/storefront/reviews';
import { useToast } from '@/components/shared/ui/Toast';
import Link from 'next/link';

interface ProductReviewsProps {
  productId: string;
  locale: string;
  reviews: any[];
  isLoggedIn: boolean;
  currentUser?: { name: string; email: string } | null;
}

export default function ProductReviews({ productId, locale, reviews, isLoggedIn, currentUser }: ProductReviewsProps) {
  const isAr = locale === 'ar';
  const { showToast } = useToast();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      showToast(isAr ? 'الرجاء اختيار التقييم أولاً' : 'Please select a rating first', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview(productId, rating, comment);
      setIsSuccess(true);
      showToast(isAr ? 'تم إرسال تقييمك وسيكون متاحاً بعد المراجعة' : 'Review submitted and is pending approval', 'success');
      setRating(0);
      setComment('');
    } catch (error: any) {
      showToast(error.message || (isAr ? 'حدث خطأ ما' : 'An error occurred'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-md border border-gray-100 p-8 sm:p-12 shadow-sm mt-12">
      <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b border-gray-200 pb-4 flex items-center justify-between">
        <span>{isAr ? 'تقييمات المنتجات' : 'Product Reviews'}</span>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-lg">
            <span className="font-bold text-amber-500">{averageRating}</span>
            <div className="flex">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <span className="text-gray-400 text-sm font-normal">({reviews.length} {isAr ? 'تقييم' : 'reviews'})</span>
          </div>
        )}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-md border border-gray-100">
              <p className="text-gray-500">
                {isAr ? 'لا توجد تقييمات لهذا المنتج حتى الآن. كن أول من يقيّمه!' : 'No reviews for this product yet. Be the first to review!'}
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {review.user.avatar ? (
                      <img src={review.user.avatar} alt={review.user.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <UserCircle2 className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900">{review.user.name}</h4>
                      <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 mt-3 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Review Form */}
        <div className="bg-gray-50 p-6 rounded-md border border-gray-100 h-fit">
          <h3 className="font-bold text-lg mb-4">{isAr ? 'أضف تقييمك' : 'Add Your Review'}</h3>
          
          {!isLoggedIn ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-600 mb-4">
                {isAr ? 'يجب عليك تسجيل الدخول لإضافة تقييم لهذا المنتج' : 'You must be logged in to review this product'}
              </p>
              <Link 
                href={`/${locale}/login`}
                className="inline-block bg-black text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                {isAr ? 'تسجيل الدخول' : 'Login'}
              </Link>
            </div>
          ) : isSuccess ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm border border-green-100 text-center">
              {isAr ? 'تم إرسال تقييمك بنجاح. سيظهر هنا بعد مراجعته والموافقة عليه من قبل الإدارة.' : 'Your review has been submitted successfully and will appear here after approval.'}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentUser && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{isAr ? 'الاسم' : 'Name'}</label>
                    <input 
                      type="text" 
                      value={currentUser.name} 
                      disabled 
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                    <input 
                      type="email" 
                      value={currentUser.email} 
                      disabled 
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">{isAr ? 'تقييمك للمنتج *' : 'Your Rating *'}</label>
                <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoverRating || rating) 
                            ? 'fill-amber-500 text-amber-500' 
                            : 'text-gray-300 hover:text-amber-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{isAr ? 'التعليق' : 'Comment'}</label>
                <textarea 
                  rows={4} 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder={isAr ? 'اكتب رأيك هنا...' : 'Write your review here...'}
                />
              </div>

              <Button type="submit" isLoading={isSubmitting} className="w-full bg-black text-white rounded-md font-bold">
                {isAr ? 'إرسال التقييم' : 'Submit Review'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
