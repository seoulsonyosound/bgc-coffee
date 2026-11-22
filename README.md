# BGC COFFEE — Full-Stack Coffee E-Commerce & Management System

A modern, responsive coffee ordering and administrative management web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**, architected for future **Amazon Web Services (AWS)** cloud deployment.

## Features

### Customer-Facing Storefront
- **Homepage (`/`)**: Hero banner, dynamic Featured Brews, Signature Series promotional spotlight, About BGC Coffee preview, and responsive navigation/footer.
- **Coffee Menu (`/menu`)**: Live search, category filtering (`Best Sellers`, `Espresso-Based`, `Iced Coffee`, `Hot Coffee`, `Non-Coffee`, `Specialty Drinks`), availability filtering, and PHP (`₱`) pricing.
- **Product Details (`/menu/[slug]`)**: Cup size variants, serving temperature (`Iced` / `Hot`), tasting notes, quantity selector, and Add to Cart.
- **Shopping Cart (`/cart`)**: Client-side `localStorage` persistence, quantity controls, item removal, subtotals, and empty state.
- **Cash on Pickup Checkout (`/checkout`)**: Form validation, Cash on Pickup payment only, order creation via Next.js Route Handlers.
- **Order Confirmation (`/order-confirmation`)**: Displays generated order reference (`BGC-XXXXXX-XXXX`), items, total, payment method, and initial `Pending` status.
- **About Us (`/about`) & Contact (`/contact`)**: Brand story, mission/vision placeholders, contact placeholders, and validated contact form.

### Administrative Dashboard
- **Admin Login (`/admin/login`)**: Prototype authentication using documented demo credentials (not production-grade security).
- **Dashboard Overview (`/admin/dashboard`)**: Live KPI cards (Total Products, Total Orders, Pending Orders, Completed Orders, Total Sales), status breakdown bar chart, and recent orders table.
- **Product Management (`/admin/products`)**: Full CRUD (Add, Edit, Delete, toggle Availability & Featured status, select preset images or upload custom images).
- **Order Management (`/admin/orders`)**: View pickup orders, inspect details, filter by status, and update statuses (`Pending`, `Confirmed`, `Preparing`, `Ready for Pickup`, `Completed`, `Cancelled`).

## Prototype Demo Credentials

> **Note:** Local mock authentication is for development and academic demonstration only—not production security.

- **Admin Portal URL:** `/admin/login`
- **Email:** `admin@bgccoffee.demo`
- **Password:** `BgcAdmin2026!`

## Local Data Persistence Note

- **Server-side mock database:** `src/lib/mock-db.ts` stores prototype records in `.data/mock-db.json` (git-ignored). This is **not** a production database.
- **Client-side storage:** `localStorage` (`src/lib/storage.ts`) is used only for shopping cart persistence and prototype UI state.

## Future AWS Integration Path (Phase 2)

The service layer (`src/services/product-service.ts`, `src/services/order-service.ts`) and asset helper (`src/lib/aws-config.ts`) are structured for a clean swap to AWS:
- **Compute:** Amazon EC2 (Ubuntu Server LTS, Node.js, Nginx reverse proxy)
- **Database:** Amazon DynamoDB (`bgc-coffee-products`, `bgc-coffee-orders`) via AWS SDK for JavaScript v3 (`@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`)
- **Storage:** Amazon S3 for product photos and banners via `NEXT_PUBLIC_S3_ASSETS_URL`
- **Networking & Security:** Amazon VPC, Public Subnet, IGW, EC2 Security Groups, Gateway VPC Endpoints for S3/DynamoDB, and an EC2 IAM Instance Role with least-privilege permissions (zero hardcoded credentials).

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Verify

```bash
npx tsc --noEmit
npm run lint
npm run build
```
