import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { isS3UploadConfigured, uploadProductImageToS3 } from "@/lib/s3";

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { error: "Administrator authentication required." },
        { status: 403 }
      );
    }

    if (!isS3UploadConfigured()) {
      return NextResponse.json(
        { fallback: true, error: "S3 upload bucket is not configured." },
        { status: 501 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image format. Use PNG, JPG, WEBP, GIF, or AVIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "Image must be smaller than 5MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { key, url } = await uploadProductImageToS3({
      buffer,
      contentType: file.type,
      originalFileName: file.name || "product.png",
    });

    return NextResponse.json({ url, key, storage: "s3" }, { status: 201 });
  } catch (error) {
    console.error("[API POST /api/admin/upload]", error);
    return NextResponse.json(
      { error: "Failed to upload image to S3." },
      { status: 500 }
    );
  }
}
