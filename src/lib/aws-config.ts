/**
 * Future AWS Integration Configuration (Non-Secret)
 *
 * IMPORTANT:
 * - During the initial local prototype stage, DATA_SOURCE defaults to "mock".
 * - Do NOT hardcode AWS access keys or secret keys in source files.
 * - In production on Amazon EC2, AWS SDK v3 automatically uses the attached
 *   EC2 IAM Instance Role with least-privilege permissions for DynamoDB and S3.
 */

export const AWS_CONFIG = {
  dataSource: (process.env.BGC_DATA_SOURCE || "mock") as "mock" | "dynamodb",
  region: process.env.AWS_REGION || "ap-southeast-1",
  dynamodb: {
    productsTable: process.env.DYNAMODB_PRODUCTS_TABLE || "bgc-coffee-products",
    ordersTable: process.env.DYNAMODB_ORDERS_TABLE || "bgc-coffee-orders",
    customersTable: process.env.DYNAMODB_CUSTOMERS_TABLE || "bgc-coffee-customers",
  },
  s3: {
    bucketName: process.env.S3_ASSETS_BUCKET || "",
    publicBaseUrl: process.env.NEXT_PUBLIC_S3_ASSETS_URL || "",
  },
} as const;

/**
 * Resolves a product or banner image path.
 * In local prototype mode, returns the local `/images/...` path.
 * When migrated to Amazon S3, prefixes relative keys with NEXT_PUBLIC_S3_ASSETS_URL.
 */
export function resolveAssetUrl(imagePath: string): string {
  if (!imagePath) return "/images/final-products/Iced-Spanish-Oat-Latte.png";
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }

  const s3Base = process.env.NEXT_PUBLIC_S3_ASSETS_URL;
  if (s3Base && !imagePath.startsWith("/")) {
    return `${s3Base.replace(/\/$/, "")}/${imagePath}`;
  }

  return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
}
