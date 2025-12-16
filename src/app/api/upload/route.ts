
import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2 } from '@/lib/r2';

export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Missing filename or content type' }, { status: 400 });
    }

    // Generate a unique filename to avoid collisions
    const uniqueFilename = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9.]/g, '_')}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueFilename,
      ContentType: contentType,
    });

    // Generate Pre-signed URL (valid for 5 minutes)
    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

    // Construct the public URL
    const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${uniqueFilename}`;

    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error('R2 Presign Error:', error);
    return NextResponse.json({ error: 'Failed to create upload URL' }, { status: 500 });
  }
}
