import { CustomerInfo } from "./customer";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Ready for Pickup"
  | "Completed"
  | "Cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready for Pickup",
  "Completed",
  "Cancelled",
];

export type PaymentMethod = "Cash on Pickup";

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  variantLabel?: string;
  temperature?: "Iced" | "Hot";
  subtotal: number;
}

export interface Order {
  id: string;
  orderReference: string;
  customerId?: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  customer: CustomerInfo;
  items: {
    productId: string;
    productName: string;
    productSlug: string;
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    variantLabel?: string;
    temperature?: "Iced" | "Hot";
  }[];
  paymentMethod?: PaymentMethod;
}
