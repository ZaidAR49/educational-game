"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import { requireAuth } from "./utils";

/**
 * Get bucket name from environment
 */
const getBucketName = () => {
  const bucket = process.env.SUPABASE_S3_BUCKET;
  if (!bucket) throw new Error("SUPABASE_S3_BUCKET environment variable is not set");
  return bucket;
};

// Bug #6 Fix: strict allowlist of accepted MIME types and their safe extensions
const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

/**
 * Uploads a file to Supabase S3 Storage.
 * Generates a unique key and returns the public URL.
 */
export async function uploadLogoAction(formData: FormData) {
  // 1. Enforce authentication
  await requireAuth();

  // 2. Extract file from FormData
  const file = formData.get("file") as File;
  if (!file || !(file instanceof File)) {
    throw new Error("No valid file provided.");
  }

  // 3. Bug #6 Fix: Validate file type against allowlist
  const fileExtension = ALLOWED_MIME_TYPES[file.type];
  if (!fileExtension) {
    throw new Error(
      `Invalid file type "${file.type}". Only JPEG, PNG, WebP, SVG, and GIF images are allowed.`
    );
  }

  // 4. Bug #6 Fix: Validate file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 2 MB.`);
  }

  // 5. Prepare File Data
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Generate a unique file name using native Node crypto 
  const uniqueId = crypto.randomUUID();
  // Extension is derived from trusted MIME type, NOT from user-supplied filename
  const key = `${uniqueId}.${fileExtension}`;

  // 6. Upload to S3
  const bucketName = getBucketName();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    // Note: Supabase public buckets don't require ACL modifications here
  });

  await s3Client.send(command);

  // 7. Construct Public URL
  const endpoint = process.env.SUPABASE_S3_ENDPOINT!;
  const urlParts = new URL(endpoint);
  const projectId = urlParts.hostname.split('.')[0]; 
  
  const publicUrl = `https://${projectId}.supabase.co/storage/v1/object/public/${bucketName}/${key}`;

  return publicUrl;
}

