import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { hasAdminPermission } from '@/lib/permissions';

export async function POST(req: Request) {
  try {
    const allowed = await hasAdminPermission('media.view');
    if (!allowed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const rawFolder = (formData.get('folder') as string | null) || 'sliders';
    const folder = ['media', 'sliders', 'avatars', 'products', 'categories', 'brands'].includes(rawFolder)
      ? rawFolder
      : rawFolder.replace(/[^a-zA-Z0-9_-]/g, '') || 'sliders';

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${filename}`;
    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
