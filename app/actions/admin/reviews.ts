"use server";

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getAdminReviews() {
  await requireAdmin();

  const reviews = await prisma.review.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      },
      product: {
        select: {
          nameAr: true,
          nameEn: true,
          slug: true,
        }
      }
    }
  });

  const reviewsWithCount = reviews.map(review => {
    const count = reviews.filter(r => r.userId === review.userId && r.productId === review.productId).length;
    return {
      ...review,
      userReviewsOnProductCount: count
    };
  });

  return reviewsWithCount;
}

export async function toggleReviewStatus(id: string, isApproved: boolean) {
  await requireAdmin();

  const review = await prisma.review.update({
    where: { id },
    data: { isApproved },
    include: { product: true }
  });

  if (review.product) {
    revalidatePath(`/[locale]/products/${review.product.slug}`, 'page');
  }

  return review;
}

export async function deleteReview(id: string) {
  await requireAdmin();

  const review = await prisma.review.delete({
    where: { id },
    include: { product: true }
  });

  if (review.product) {
    revalidatePath(`/[locale]/products/${review.product.slug}`, 'page');
  }

  return { success: true };
}
