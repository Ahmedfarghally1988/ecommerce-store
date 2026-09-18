import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getAdminSession, getCustomerSession } from '@/lib/auth';
import sharp from 'sharp';

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminSession();
    const customerSession = await getCustomerSession();
    
    if (!adminSession && !customerSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    await mkdir(uploadDir, { recursive: true });

    let safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const lastDotIndex = safeName.lastIndexOf('.');
    if (lastDotIndex > 0) {
      safeName = safeName.substring(0, lastDotIndex);
    }
    const filename = `${Date.now()}-${safeName}.webp`;
    const filePath = path.join(uploadDir, filename);

    // Convert to webp using sharp
    const processedBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();

    await writeFile(filePath, processedBuffer);

    const publicUrl = `/uploads/avatars/${filename}`;
    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
