import { z } from 'zod';

export const heroSlideSchema = z.object({
  titleEn: z.string().optional().nullable().transform(val => val ?? ''),
  titleAr: z.string().optional().nullable().transform(val => val ?? ''),
  descriptionEn: z.string().optional().nullable().transform(val => val || null),
  descriptionAr: z.string().optional().nullable().transform(val => val || null),
  image: z.string().min(1, 'صورة الديسكتوب مطلوبة / Desktop image is required'),
  mobileImage: z.string().optional().nullable().transform(val => val || null),
  buttonTextEn: z.string().optional().nullable().transform(val => val || null),
  buttonTextAr: z.string().optional().nullable().transform(val => val || null),
  buttonUrl: z.string().optional().nullable().transform(val => val || null),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type HeroSlideInput = z.infer<typeof heroSlideSchema>;
