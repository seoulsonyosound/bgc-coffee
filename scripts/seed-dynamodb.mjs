/**
 * Idempotent Amazon DynamoDB Seed Script for BGC Coffee
 *
 * Usage on EC2 (uses attached EC2 IAM Instance Role, zero hardcoded keys):
 *   node scripts/seed-dynamodb.mjs
 *
 * Automatically loads `.env.local` if present in the project root.
 */

import fs from "fs";
import path from "path";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    const value = line.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

const region = process.env.AWS_REGION || "ap-southeast-2";
const productsTable =
  process.env.DYNAMODB_PRODUCTS_TABLE || "bgc-coffee-products";
const ordersTable = process.env.DYNAMODB_ORDERS_TABLE || "bgc-coffee-orders";

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region }), {
  marshallOptions: { removeUndefinedValues: true },
});

const INITIAL_PRODUCTS = [
  {
    id: "prod-americano",
    slug: "americano",
    name: "Americano",
    description: "Double Espresso, Water, Ice.",
    ingredients: ["Double Espresso", "Water", "Ice"],
    badges: [],
    category: "Espresso-Based",
    price: 50,
    imageUrl: "/images/final-products/Iced-Americano.png",
    available: true,
    featured: false,
    temperatureOptions: ["Iced"],
    variants: [{ id: "std", label: "Standard", priceDelta: 0 }],
    createdAt: "2026-11-01T08:00:00.000Z",
    updatedAt: "2026-11-01T08:00:00.000Z",
  },
  {
    id: "prod-latte",
    slug: "latte",
    name: "Latte",
    description: "Double Espresso, Full Cream Milk, Ice.",
    ingredients: ["Double Espresso", "Full Cream Milk", "Ice"],
    badges: [],
    category: "Espresso-Based",
    price: 80,
    imageUrl: "/images/final-products/Iced-Latte.png",
    available: true,
    featured: false,
    temperatureOptions: ["Iced"],
    variants: [{ id: "std", label: "Standard", priceDelta: 0 }],
    createdAt: "2026-11-01T08:05:00.000Z",
    updatedAt: "2026-11-01T08:05:00.000Z",
  },
  {
    id: "prod-salted-spanish-oat-latte",
    slug: "salted-spanish-oat-latte",
    name: "Salted Spanish Oat Latte",
    description: "Double Espresso, Oat Milk, Condensed Milk, Salt, Ice.",
    ingredients: [
      "Double Espresso",
      "Oat Milk",
      "Condensed Milk",
      "Salt",
      "Ice",
    ],
    badges: ["Barista's Choice", "Best Seller"],
    category: "Espresso-Based",
    price: 100,
    imageUrl: "/images/final-products/Iced-Spanish-Oat-Latte.png",
    available: true,
    featured: true,
    temperatureOptions: ["Iced"],
    variants: [{ id: "std", label: "Standard", priceDelta: 0 }],
    createdAt: "2026-11-01T08:10:00.000Z",
    updatedAt: "2026-11-01T08:10:00.000Z",
  },
  {
    id: "prod-caramel-macchiato",
    slug: "caramel-macchiato",
    name: "Caramel Macchiato",
    description: "Espresso, Full Cream Milk, Vanilla, Caramel, Ice.",
    ingredients: ["Espresso", "Full Cream Milk", "Vanilla", "Caramel", "Ice"],
    badges: [],
    category: "Espresso-Based",
    price: 110,
    imageUrl: "/images/final-products/Caramel-Macchiato.png",
    available: true,
    featured: false,
    temperatureOptions: ["Iced"],
    variants: [{ id: "std", label: "Standard", priceDelta: 0 }],
    createdAt: "2026-11-01T08:15:00.000Z",
    updatedAt: "2026-11-01T08:15:00.000Z",
  },
  {
    id: "prod-burnt-matcha",
    slug: "burnt-matcha",
    name: "Burnt Matcha",
    description: "Double Espresso, Matcha Powder, Oat Milk, Sweetener, Ice.",
    ingredients: [
      "Double Espresso",
      "Matcha Powder",
      "Oat Milk",
      "Sweetener",
      "Ice",
    ],
    badges: ["Barista's Choice"],
    category: "Espresso-Based",
    price: 120,
    imageUrl: "/images/final-products/Burnt-Matcha.png",
    available: true,
    featured: true,
    temperatureOptions: ["Iced"],
    variants: [{ id: "std", label: "Standard", priceDelta: 0 }],
    createdAt: "2026-11-01T08:20:00.000Z",
    updatedAt: "2026-11-01T08:20:00.000Z",
  },
  {
    id: "prod-sea-salt-cloud",
    slug: "sea-salt-cloud",
    name: "Sea Salt Cloud",
    description: "Double Espresso, Oat Milk, Sea Salt Breve, Ice.",
    ingredients: ["Double Espresso", "Oat Milk", "Sea Salt Breve", "Ice"],
    badges: ["Best Seller"],
    category: "Espresso-Based",
    price: 120,
    imageUrl: "/images/final-products/Sea-Salt-Cloud.png",
    available: true,
    featured: true,
    temperatureOptions: ["Iced"],
    variants: [{ id: "std", label: "Standard", priceDelta: 0 }],
    createdAt: "2026-11-01T08:25:00.000Z",
    updatedAt: "2026-11-01T08:25:00.000Z",
  },
  {
    id: "prod-strawberry-latte",
    slug: "strawberry-latte",
    name: "Strawberry Latte",
    description: "Strawberry Puree, Full Cream Milk, Ice.",
    ingredients: ["Strawberry Puree", "Full Cream Milk", "Ice"],
    badges: [],
    category: "Non-Espresso",
    price: 80,
    imageUrl: "/images/final-products/Strawberry-Latte.png",
    available: true,
    featured: false,
    temperatureOptions: ["Iced"],
    variants: [{ id: "std", label: "Standard", priceDelta: 0 }],
    createdAt: "2026-11-01T08:30:00.000Z",
    updatedAt: "2026-11-01T08:30:00.000Z",
  },
  {
    id: "prod-matcha-latte",
    slug: "matcha-latte",
    name: "Matcha Latte",
    description: "Matcha, Full Cream Milk, Sweetener, Ice.",
    ingredients: ["Matcha", "Full Cream Milk", "Sweetener", "Ice"],
    badges: ["Best Seller"],
    category: "Non-Espresso",
    price: 100,
    imageUrl: "/images/final-products/Matcha-Latte.png",
    available: true,
    featured: true,
    temperatureOptions: ["Iced"],
    variants: [{ id: "std", label: "Standard", priceDelta: 0 }],
    createdAt: "2026-11-01T08:35:00.000Z",
    updatedAt: "2026-11-01T08:35:00.000Z",
  },
  {
    id: "prod-strawberry-matcha",
    slug: "strawberry-matcha",
    name: "Strawberry Matcha",
    description: "Strawberry Puree, Matcha, Full Cream Milk, Ice.",
    ingredients: ["Strawberry Puree", "Matcha", "Full Cream Milk", "Ice"],
    badges: [],
    category: "Non-Espresso",
    price: 115,
    imageUrl: "/images/final-products/Strawberry-Matcha.png",
    available: true,
    featured: false,
    temperatureOptions: ["Iced"],
    variants: [{ id: "std", label: "Standard", priceDelta: 0 }],
    createdAt: "2026-11-01T08:40:00.000Z",
    updatedAt: "2026-11-01T08:40:00.000Z",
  },
  {
    id: "prod-sea-salt-cream-matcha",
    slug: "sea-salt-cream-matcha",
    name: "Sea Salt Cream Matcha",
    description: "Matcha, Full Cream Milk, Sea Salt Breve, Ice.",
    ingredients: ["Matcha", "Full Cream Milk", "Sea Salt Breve", "Ice"],
    badges: [],
    category: "Non-Espresso",
    price: 120,
    imageUrl: "/images/final-products/Sea-Salt-Cream-Matcha.png",
    available: true,
    featured: false,
    temperatureOptions: ["Iced"],
    variants: [{ id: "std", label: "Standard", priceDelta: 0 }],
    createdAt: "2026-11-01T08:45:00.000Z",
    updatedAt: "2026-11-01T08:45:00.000Z",
  },
  {
    id: "prod-strawberry-fizz",
    slug: "strawberry-fizz",
    name: "Strawberry Fizz",
    description: "Strawberry Puree, Lemon Soda, Ice.",
    ingredients: ["Strawberry Puree", "Lemon Soda", "Ice"],
    badges: [],
    category: "Fruit Spritzers",
    price: 70,
    imageUrl: "/images/final-products/Strawberry-Fizz.png",
    available: true,
    featured: false,
    temperatureOptions: ["Iced"],
    variants: [{ id: "std", label: "Standard", priceDelta: 0 }],
    createdAt: "2026-11-01T08:50:00.000Z",
    updatedAt: "2026-11-01T08:50:00.000Z",
  },
  {
    id: "prod-lychee-fizz",
    slug: "lychee-fizz",
    name: "Lychee Fizz",
    description: "Lychee Juice, Fresh Lychee Fruits, Lemon Soda, Ice.",
    ingredients: ["Lychee Juice", "Fresh Lychee Fruits", "Lemon Soda", "Ice"],
    badges: ["Barista's Choice"],
    category: "Fruit Spritzers",
    price: 90,
    imageUrl: "/images/final-products/Lychee-Fizz.png",
    available: true,
    featured: false,
    temperatureOptions: ["Iced"],
    variants: [{ id: "std", label: "Standard", priceDelta: 0 }],
    createdAt: "2026-11-01T08:55:00.000Z",
    updatedAt: "2026-11-01T08:55:00.000Z",
  },
];

const INITIAL_ORDERS = [
  {
    id: "ord-1001",
    orderReference: "BGC-261122-1042",
    customer: {
      fullName: "Camille Santos",
      contactNumber: "0917-000-0101",
      email: "camille.demo@example.com",
      pickupNotes:
        "Less ice on the Salted Spanish Oat Latte, picking up in 15 mins.",
    },
    items: [
      {
        productId: "prod-salted-spanish-oat-latte",
        productName: "Salted Spanish Oat Latte",
        productSlug: "salted-spanish-oat-latte",
        imageUrl: "/images/final-products/Iced-Spanish-Oat-Latte.png",
        unitPrice: 100,
        quantity: 2,
        variantLabel: "Standard",
        temperature: "Iced",
        subtotal: 200,
      },
      {
        productId: "prod-americano",
        productName: "Americano",
        productSlug: "americano",
        imageUrl: "/images/final-products/Iced-Americano.png",
        unitPrice: 50,
        quantity: 1,
        variantLabel: "Standard",
        temperature: "Iced",
        subtotal: 50,
      },
    ],
    subtotal: 250,
    totalAmount: 250,
    paymentMethod: "Cash on Pickup",
    status: "Pending",
    createdAt: "2026-11-22T08:45:00.000Z",
    updatedAt: "2026-11-22T08:45:00.000Z",
  },
  {
    id: "ord-1002",
    orderReference: "BGC-261122-1039",
    customer: {
      fullName: "Marco Reyes",
      contactNumber: "0918-000-0202",
      pickupNotes: "No straw needed.",
    },
    items: [
      {
        productId: "prod-burnt-matcha",
        productName: "Burnt Matcha",
        productSlug: "burnt-matcha",
        imageUrl: "/images/final-products/Burnt-Matcha.png",
        unitPrice: 120,
        quantity: 1,
        variantLabel: "Standard",
        temperature: "Iced",
        subtotal: 120,
      },
      {
        productId: "prod-matcha-latte",
        productName: "Matcha Latte",
        productSlug: "matcha-latte",
        imageUrl: "/images/final-products/Matcha-Latte.png",
        unitPrice: 110,
        quantity: 1,
        variantLabel: "Sub: Oat Milk",
        temperature: "Iced",
        subtotal: 110,
      },
    ],
    subtotal: 230,
    totalAmount: 230,
    paymentMethod: "Cash on Pickup",
    status: "Preparing",
    createdAt: "2026-11-22T08:15:00.000Z",
    updatedAt: "2026-11-22T08:20:00.000Z",
  },
  {
    id: "ord-1003",
    orderReference: "BGC-261122-1028",
    customer: {
      fullName: "Andrea Lim",
      contactNumber: "0919-000-0303",
      email: "andrea.demo@example.com",
    },
    items: [
      {
        productId: "prod-sea-salt-cloud",
        productName: "Sea Salt Cloud",
        productSlug: "sea-salt-cloud",
        imageUrl: "/images/final-products/Sea-Salt-Cloud.png",
        unitPrice: 120,
        quantity: 2,
        variantLabel: "Standard",
        temperature: "Iced",
        subtotal: 240,
      },
    ],
    subtotal: 240,
    totalAmount: 240,
    paymentMethod: "Cash on Pickup",
    status: "Ready for Pickup",
    createdAt: "2026-11-22T07:50:00.000Z",
    updatedAt: "2026-11-22T08:05:00.000Z",
  },
  {
    id: "ord-1004",
    orderReference: "BGC-261121-9814",
    customer: {
      fullName: "Joshua Mendoza",
      contactNumber: "0920-000-0404",
      pickupNotes: "Extra lychee if available.",
    },
    items: [
      {
        productId: "prod-lychee-fizz",
        productName: "Lychee Fizz",
        productSlug: "lychee-fizz",
        imageUrl: "/images/final-products/Lychee-Fizz.png",
        unitPrice: 90,
        quantity: 1,
        variantLabel: "Standard",
        temperature: "Iced",
        subtotal: 90,
      },
      {
        productId: "prod-strawberry-matcha",
        productName: "Strawberry Matcha",
        productSlug: "strawberry-matcha",
        imageUrl: "/images/final-products/Strawberry-Matcha.png",
        unitPrice: 115,
        quantity: 2,
        variantLabel: "Standard",
        temperature: "Iced",
        subtotal: 230,
      },
    ],
    subtotal: 320,
    totalAmount: 320,
    paymentMethod: "Cash on Pickup",
    status: "Completed",
    createdAt: "2026-11-21T15:30:00.000Z",
    updatedAt: "2026-11-21T15:55:00.000Z",
  },
  {
    id: "ord-1005",
    orderReference: "BGC-261121-9760",
    customer: {
      fullName: "Bianca Cruz",
      contactNumber: "0917-000-0505",
    },
    items: [
      {
        productId: "prod-caramel-macchiato",
        productName: "Caramel Macchiato",
        productSlug: "caramel-macchiato",
        imageUrl: "/images/final-products/Caramel-Macchiato.png",
        unitPrice: 110,
        quantity: 2,
        variantLabel: "Standard",
        temperature: "Iced",
        subtotal: 220,
      },
    ],
    subtotal: 220,
    totalAmount: 220,
    paymentMethod: "Cash on Pickup",
    status: "Completed",
    createdAt: "2026-11-21T11:20:00.000Z",
    updatedAt: "2026-11-21T11:45:00.000Z",
  },
];

async function seedTable(tableName, items) {
  let inserted = 0;
  let skipped = 0;

  for (const item of items) {
    try {
      await docClient.send(
        new PutCommand({
          TableName: tableName,
          Item: item,
          ConditionExpression: "attribute_not_exists(id)",
        })
      );
      inserted += 1;
    } catch (err) {
      if (err && err.name === "ConditionalCheckFailedException") {
        skipped += 1;
      } else {
        throw err;
      }
    }
  }

  console.log(
    `[seed] ${tableName}: ${inserted} inserted, ${skipped} already existed.`
  );
}

async function main() {
  console.log(`[seed] Seeding DynamoDB in region ${region}...`);
  await seedTable(productsTable, INITIAL_PRODUCTS);
  await seedTable(ordersTable, INITIAL_ORDERS);
  console.log("[seed] Done.");
}

main().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
