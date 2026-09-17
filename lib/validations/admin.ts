import { z } from 'zod';

export const categorySchema = z.object({
  nameEn: z.string().min(2, 'English name is required'),
  nameAr: z.string().min(2, 'Arabic name is required'),
  slug: z.string().min(2, 'Slug is required'),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  showInHeader: z.boolean().default(true),
  showInFooter: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  parentId: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  customSchema: z.string().optional().nullable(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const brandSchema = z.object({
  nameEn: z.string().min(2, 'English name is required'),
  nameAr: z.string().min(2, 'Arabic name is required'),
  slug: z.string().min(2, 'Slug is required'),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  logo: z.string().optional().nullable(),
});

export type BrandInput = z.infer<typeof brandSchema>;

export const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters'),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.coerce.number().positive('Value must be positive'),
  minimumOrder: z.coerce.number().min(0).optional().nullable(),
  maximumDiscount: z.coerce.number().min(0).optional().nullable(),
  usageLimit: z.coerce.number().int().min(1).optional().nullable(),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional().nullable(), // Store as ISO string
  expiresAt: z.string().optional().nullable(),
});

export type CouponInput = z.infer<typeof couponSchema>;

export const settingsSchema = z.object({
  store_name: z.string().min(1, 'Store name is required'),
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  contact_phone: z.string().optional().or(z.literal('')),
  whatsapp: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  store_location_map: z.string().optional().or(z.literal('')),
  logo: z.string().optional().or(z.literal('')),
  footer_logo: z.string().optional().or(z.literal('')),
  favicon: z.string().optional().or(z.literal('')),
  header_tagline_ar: z.string().optional().or(z.literal('')),
  header_tagline_en: z.string().optional().or(z.literal('')),
  index_title_ar: z.string().optional().or(z.literal('')),
  index_title_en: z.string().optional().or(z.literal('')),
  index_description_ar: z.string().optional().or(z.literal('')),
  index_description_en: z.string().optional().or(z.literal('')),
  custom_social_links: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, 'Name is required'),
    url: z.string().min(1, 'URL is required')
  })).optional().default([]),
  privacy_policy_title_ar: z.string().optional().or(z.literal('')),
  privacy_policy_title_en: z.string().optional().or(z.literal('')),
  privacy_policy_ar: z.string().optional().or(z.literal('')),
  privacy_policy_en: z.string().optional().or(z.literal('')),
  terms_of_use_title_ar: z.string().optional().or(z.literal('')),
  terms_of_use_title_en: z.string().optional().or(z.literal('')),
  terms_of_use_ar: z.string().optional().or(z.literal('')),
  terms_of_use_en: z.string().optional().or(z.literal('')),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export const shippingSchema = z.object({
  shipping_base_cost: z.string().optional().or(z.literal('')),
  shipping_free_threshold: z.string().optional().or(z.literal('')),
  shipping_regions: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, 'Region name is required'),
    cost: z.string().min(1, 'Cost is required'),
  })).optional().default([]),
});

export type ShippingInput = z.infer<typeof shippingSchema>;

export const productSchema = z.object({
  nameEn: z.string().min(2, 'English name is required'),
  nameAr: z.string().min(2, 'Arabic name is required'),
  slug: z.string().min(2, 'Slug is required'),
  shortDescriptionEn: z.string().optional().nullable(),
  shortDescriptionAr: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  sku: z.string().min(2, 'SKU is required'),
  price: z.coerce.number().positive('Price must be positive'),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
  costPrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  weight: z.coerce.number().min(0).optional().nullable(),
  isFeatured: z.boolean().default(false),
  isLatest: z.boolean().default(false),
  isSpecialOffer: z.boolean().default(false),
  isActive: z.boolean().default(true),
  showRelatedProducts: z.boolean().default(true),
  categoryId: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  customSchema: z.string().optional().nullable(),
  images: z.array(z.string()).optional().default([]),
  variants: z.array(z.object({
    id: z.string().optional(),
    nameEn: z.string().min(1, 'English variant name is required'),
    nameAr: z.string().min(1, 'Arabic variant name is required'),
    sku: z.string().min(1, 'Variant SKU is required'),
    price: z.coerce.number().min(0),
    stock: z.coerce.number().int().min(0).default(0),
    attributes: z.record(z.string(), z.string()).optional(),
  })).optional().default([]),
});

export type ProductInput = z.infer<typeof productSchema>;

export const bannerSchema = z.object({
  titleEn: z.string().optional(),
  titleAr: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  link: z.string().optional(),
  position: z.enum(['GRID', 'SPECIAL_OFFER']).default('GRID'),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type BannerInput = z.infer<typeof bannerSchema>;

export const redirectSchema = z.object({ source: z.string().min(1, 'Source is required').startsWith('/', 'Source must start with /'), destination: z.string().min(1, 'Destination is required'), isPermanent: z.boolean().default(true) });
export type RedirectInput = z.infer<typeof redirectSchema>;
