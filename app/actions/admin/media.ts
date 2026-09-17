"use server";

import fs from 'fs/promises';
import path from 'path';
import { checkActionPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  relativePath: string;
  folder: string;
  size: number;
  createdAt: string;
}

export async function getMediaFiles(): Promise<MediaItem[]> {
  const uploadsRoot = path.join(process.cwd(), 'public', 'uploads');
  const items: MediaItem[] = [];

  async function scanDir(currentDir: string, folderName: string) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          await scanDir(fullPath, entry.name);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif', '.jfif'];
          if (validExts.includes(ext)) {
            const stats = await fs.stat(fullPath);
            const relFromUploads = path.relative(uploadsRoot, fullPath).replace(/\\/g, '/');
            items.push({
              id: relFromUploads,
              name: entry.name,
              url: `/uploads/${relFromUploads}`,
              relativePath: relFromUploads,
              folder: folderName,
              size: stats.size,
              createdAt: stats.birthtime.toISOString() || stats.mtime.toISOString(),
            });
          }
        }
      }
    } catch (e) {
      // ignore missing directories
    }
  }

  await scanDir(uploadsRoot, 'عام');

  // Sort newest first
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return items;
}

export async function deleteMediaFile(relativePath: string) {
  await checkActionPermission('media.view');

  const uploadsRoot = path.resolve(process.cwd(), 'public', 'uploads');
  const targetPath = path.resolve(uploadsRoot, relativePath);

  // Security check: ensure targetPath starts with uploadsRoot
  if (!targetPath.startsWith(uploadsRoot)) {
    throw new Error('مسار غير مصرح به');
  }

  try {
    await fs.unlink(targetPath);
  } catch (err: any) {
    throw new Error('فشل حذف الملف: ' + err.message);
  }

  revalidatePath('/admin/media');
  return { success: true };
}
