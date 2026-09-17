import { z } from 'zod';

// ─── Login ──────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Register ───────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 characters').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Profile Update ──────────────────────────────────────────────────────────

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(7, 'Invalid phone number').optional().or(z.literal('')),
  avatar: z.string().optional().nullable(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// ─── Change Password ─────────────────────────────────────────────────────────

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ─── Address ─────────────────────────────────────────────────────────────────

export const addressSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().min(7, 'Phone number is required'),
  country: z.string().min(2, 'Country is required'),
  city: z.string().min(2, 'City is required'),
  area: z.string().optional().nullable(),
  address: z.string().min(5, 'Street address is required'),
  apartment: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
