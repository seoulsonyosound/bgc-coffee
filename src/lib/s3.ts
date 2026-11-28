import crypto from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AWS_CONFIG } from "@/lib/aws-config";

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION || AWS_CONFIG.region,
    });
  }
  return s3Client;
}

export function isS3UploadConfigured(): boolean {
  return Boolean(process.env.S3_ASSETS_BUCKET || AWS_CONFIG.s3.bucketName);
}

export async function uploadProductImageToS3(params: {
  buffer: Buffer;
  contentType: string;
  originalFileName: string;
}): Promise<{ key: string; url: string }> {
  const bucket = process.env.S3_ASSETS_BUCKET || AWS_CONFIG.s3.bucketName;
  const region = process.env.AWS_REGION || AWS_CONFIG.region;

  if (!bucket) {
    throw new Error("S3_ASSETS_BUCKET is not configured.");
  }

  const extMatch = params.originalFileName.toLowerCase().match(/\.([a-z0-9]+)$/);
  const ext = extMatch ? extMatch[1] : "png";
  const safeBase = params.originalFileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "product";

  const uniqueSuffix = crypto.randomBytes(4).toString("hex");
  const key = `images/uploads/${Date.now()}-${safeBase}-${uniqueSuffix}.${ext}`;

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: params.buffer,
      ContentType: params.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const publicBase =
    process.env.NEXT_PUBLIC_S3_ASSETS_URL ||
    `https://${bucket}.s3.${region}.amazonaws.com`;

  return {
    key,
    url: `${publicBase.replace(/\/$/, "")}/${key}`,
  };
}
