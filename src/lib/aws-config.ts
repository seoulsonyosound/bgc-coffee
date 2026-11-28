/**
 * AWS Integration Configuration (Non-Secret)
 *
 * IMPORTANT:
 * - During local development, BGC_DATA_SOURCE defaults to "mock".
 * - On Amazon EC2, set BGC_DATA_SOURCE=dynamodb.
 * - Do NOT hardcode AWS access keys or secret keys in source files.
 * - In production on Amazon EC2, AWS SDK v3 automatically uses the attached
 *   EC2 IAM Instance Role with least-privilege permissions for DynamoDB, S3, and Cognito.
 */

export const AWS_CONFIG = {
  dataSource: (process.env.BGC_DATA_SOURCE || "mock") as "mock" | "dynamodb",
  region: process.env.AWS_REGION || "ap-southeast-2",
  dynamodb: {
    productsTable: process.env.DYNAMODB_PRODUCTS_TABLE || "bgc-coffee-products",
    ordersTable: process.env.DYNAMODB_ORDERS_TABLE || "bgc-coffee-orders",
    customersTable: process.env.DYNAMODB_CUSTOMERS_TABLE || "bgc-coffee-customers",
  },
  s3: {
    bucketName: process.env.S3_ASSETS_BUCKET || "",
    publicBaseUrl: process.env.NEXT_PUBLIC_S3_ASSETS_URL || "",
  },
  cognito: {
    userPoolId: process.env.COGNITO_USER_POOL_ID || "",
    clientId: process.env.COGNITO_CLIENT_ID || "",
  },
} as const;

export function isDynamoDbMode(): boolean {
  return process.env.BGC_DATA_SOURCE === "dynamodb";
}

/**
 * Resolves a product, banner, video, or 3D model asset path.
 * In local mode (NEXT_PUBLIC_S3_ASSETS_URL unset), returns the local `/images/...` path.
 * In AWS mode (NEXT_PUBLIC_S3_ASSETS_URL set), prefixes relative paths with the S3 base URL.
 */
export function resolveAssetUrl(imagePath: string): string {
  const effectivePath =
    imagePath?.trim() || "/images/final-products/Iced-Spanish-Oat-Latte.png";

  if (
    effectivePath.startsWith("http://") ||
    effectivePath.startsWith("https://") ||
    effectivePath.startsWith("data:")
  ) {
    return effectivePath;
  }

  const s3Base = process.env.NEXT_PUBLIC_S3_ASSETS_URL;
  if (s3Base) {
    const cleanPath = effectivePath.replace(/^\/+/, "");
    return `${s3Base.replace(/\/$/, "")}/${cleanPath}`;
  }

  return effectivePath.startsWith("/") ? effectivePath : `/${effectivePath}`;
}
