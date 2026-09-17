import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { cache } from 'react';

const SECRET_KEY = process.env.JWT_SECRET;
const key = new TextEncoder().encode(SECRET_KEY);

export interface SessionPayload {
  userId: string;
  role: string;
  email: string;
  name?: string;
  avatar?: string | null;
  customerStatus?: string;
}

export interface AdminSessionPayload {
  adminUserId: string;
  role: string;
  email: string;
  name?: string;
  avatar?: string | null;
}

// ─── JWT Utilities ─────────────────────────────────────────────────────────

export async function encrypt(payload: SessionPayload | AdminSessionPayload) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

// ─── Admin Session (admin_session cookie) ──────────────────────────────────

export async function createAdminSession(payload: AdminSessionPayload) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await encrypt(payload);
  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  });
}

export const getAdminSession = cache(async (): Promise<AdminSessionPayload | null> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('admin_session');
  if (!cookie?.value) return null;
  return await decrypt(cookie.value) as AdminSessionPayload;
});

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    throw new Error('Unauthorized');
  }
  return session;
}

// ─── Customer Session (customer_session cookie) ────────────────────────────

export async function createCustomerSession(payload: SessionPayload) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await encrypt(payload);
  const cookieStore = await cookies();
  cookieStore.set('customer_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  });
}

export const getCustomerSession = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('customer_session');
  if (!cookie?.value) return null;
  return await decrypt(cookie.value);
});

export async function deleteCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete('customer_session');
}

// EOF
