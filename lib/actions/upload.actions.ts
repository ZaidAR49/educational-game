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

  // 3. Prepare File Data
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Generate a unique file name using native Node crypto 
  // (or Next.js server-side webcrypto)
  const uniqueId = crypto.randomUUID();
  const fileExtension = file.name.split(".").pop();
  const key = `${uniqueId}.${fileExtension}`;

  // 4. Upload to S3
  const bucketName = getBucketName();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    // Note: Supabase public buckets don't require ACL modifications here
  });

  await s3Client.send(command);

  // 5. Construct Public URL
  const endpoint = process.env.SUPABASE_S3_ENDPOINT!;
  const urlParts = new URL(endpoint);
  const projectId = urlParts.hostname.split('.')[0]; 
  
  const publicUrl = `https://${projectId}.supabase.co/storage/v1/object/public/${bucketName}/${key}`;

  return publicUrl;
}
