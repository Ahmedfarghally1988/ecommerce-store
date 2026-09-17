import React from 'react';
import { getAdminReviews } from '@/app/actions/admin/reviews';
import { ReviewsClient } from './ReviewsClient';
import { requireAdminPermission } from '@/lib/permissions';

export default async function AdminReviewsPage() {
  await requireAdminPermission('reviews.view');
  
  const reviews = await getAdminReviews();
  
  return <ReviewsClient reviews={reviews} />;
}
