import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { AWS_CONFIG } from "@/lib/aws-config";

/**
 * Singleton Amazon DynamoDB DocumentClient.
 * Uses the default AWS SDK v3 credential provider chain (EC2 IAM Instance Role).
 */
let docClient: DynamoDBDocumentClient | null = null;

export function getDynamoDbDocClient(): DynamoDBDocumentClient {
  if (!docClient) {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || AWS_CONFIG.region,
    });
    docClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertEmptyValues: false,
      },
    });
  }
  return docClient;
}

export function getTableNames() {
  return {
    products:
      process.env.DYNAMODB_PRODUCTS_TABLE || AWS_CONFIG.dynamodb.productsTable,
    orders:
      process.env.DYNAMODB_ORDERS_TABLE || AWS_CONFIG.dynamodb.ordersTable,
    customers:
      process.env.DYNAMODB_CUSTOMERS_TABLE ||
      AWS_CONFIG.dynamodb.customersTable,
  };
}
