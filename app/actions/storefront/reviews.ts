"use server";

import { prisma } from '@/lib/prisma';
import { getCustomerSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function submitReview(productId: string, rating: number, comment: string) {
  const session = await getCustomerSession();
  
  if (!session || !session.userId) {
    throw new Error('You must be logged in to submit a review');
  }

  // Ensure rating is between 1 and 5
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Create the review, defaults to isApproved = false
  const review = await prisma.review.create({
    data: {
      productId,
      userId: session.userId,
      rating,
      comment,
      isApproved: false, // Explicitly false for admin approval
    }
  });

  // Create notification for admin
  await prisma.notification.create({
    data: {
      type: 'NEW_REVIEW',
      title: 'تقييم جديد',
      message: `تم إضافة تقييم جديد للمنتج من قبل ${session.name || 'عميل'}. بانتظار موافقتك.`,
      link: '/admin/reviews',
    }
  }).catch(() => {}); // ignore if it fails

  // Revalidate the product page just in case, though it won't show up yet until approved
  revalidatePath('/[locale]/products/[slug]', 'page');

  return { success: true, message: 'Review submitted successfully' };
}

export async function getApprovedReviews(productId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      productId,
      isApproved: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          avatar: true,
        }
      }
    }
  });

  return reviews;
}
