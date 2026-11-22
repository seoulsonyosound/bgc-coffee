export type ProductCategory =
  | "Espresso-Based"
  | "Non-Espresso"
  | "Fruit Spritzers";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Espresso-Based",
  "Non-Espresso",
  "Fruit Spritzers",
];

export type ProductBadge = "Barista's Choice" | "Best Seller";

export interface ProductVariant {
  id: string;
  label: string;
  priceDelta: number;
}

export interface CustomizationOption {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  ingredients?: string[];
  badges?: ProductBadge[];
  category: ProductCategory;
  price: number; // Base price in Philippine Pesos (PHP)
  imageUrl: string; // Relative path in /public/images/final-products/ or future Amazon S3 URL
  available: boolean;
  featured: boolean;
  temperatureOptions: ("Iced" | "Hot")[];
  variants: ProductVariant[];
  tastingNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  ingredients?: string[];
  badges?: ProductBadge[];
  category: ProductCategory;
  price: number;
  imageUrl: string;
  available: boolean;
  featured: boolean;
  temperatureOptions?: ("Iced" | "Hot")[];
  variants?: ProductVariant[];
  tastingNotes?: string;
}

export type UpdateProductInput = Partial<CreateProductInput>;
