# MultiSeller E-Commerce Platform

## 📌 Overview

MultiSeller E-Commerce Platform is a full-stack **MERN marketplace application built with Next.js, Node.js, Express, and MongoDB** that enables multiple sellers to create and manage their own stores while providing customers with a seamless shopping experience.

The platform is built with a role-based architecture, supporting three main user types: Customers, Sellers, and Administrators. Each role has a dedicated interface and feature set designed to ensure smooth operations across the entire marketplace.

Customers can browse products, manage their cart, place orders, and interact with stores through reviews, wishlists, and following systems. Sellers  manage products, variants, inventory, shipping rules, coupons, and orders through a comprehensive seller dashboard. Administrators have full control over the platform, including user management, store approvals, categories, and system-wide configurations.

The system is designed to be scalable, flexible, and feature-rich, supporting advanced e-commerce capabilities such as dynamic shipping rules, variant-based inventory, customizable product content, and a complete order management workflow.

## 🧑‍🔧 Role-Based Access

The application provides different experiences depending on the authenticated user's role:

| Role     | Capabilities                                             |
| -------- | -------------------------------------------------------- |
| Customer | Browse products, manage cart and favorites, place orders |
| Seller   | Create stores, manage products, handle orders            |
| Admin    | Manage users, stores, and platform transactions          |

## ✨ Features

### 🛍️ Customer Features

- User registration and secure authentication
- Browse and search products from multiple sellers
- View detailed product pages with images, pricing, and specifications
- Add products to cart and manage quantities
- Save products to wishlist
- Follow favorite stores
- Complete checkout with:
  - Country-based shipping calculation
  - Coupon and discount support
  - Multiple payment options (PayPal, Stripe, etc.)
- Access a complete profile system:
  - Order history and tracking
  - Saved addresses
  - Payment methods
  - Wishlist management
  - Followed stores
  - Product view history
- Product reviews with images, Q&A sections, and related product suggestions

---

### 🏪 Seller Features

- Seller registration and store creation application system
- Create and manage online stores
- Add, update, and delete products
- Manage variant-based inventory:
  - Sizes, prices, quantities, and discounts per variant
- Manage incoming orders with product-level status tracking
- Create and manage coupons and promotions
- Configure shipping settings and fees per country
- Set seller-specific shipping rules and discounts (by weight or quantity)
- Customize product pages using dynamic HTML descriptions and specifications
- Access seller dashboard:
  - Sales analytics
  - Product management
  - Order management
  - Shipping configuration
  - Coupon system
  - Store settings

---

### 🛠️ Admin Features

- Global admin dashboard with full platform control
- Manage users (customers and sellers)
- Approve or reject seller store applications
- Manage all stores and monitor activity
- Control product categories and subcategories
- Manage promotional offers and tags
- Oversee all orders and transactions
- System-wide configuration

---

### ⚙️ Advanced Platform Capabilities

- Flexible shipping system:
  - Country-based shipping rates
  - Seller-specific shipping fee logic
  - Dynamic shipping discounts based on weight or quantity
- Advanced product system:
  - Variant-based inventory management
  - Dynamic HTML product descriptions
- Enhanced product experience:
  - Image-based reviews
  - Q&A system per product
  - Related product recommendations
- Robust cart & checkout system:
  - Coupon integration
  - Multi-payment support
  - Automatic shipping calculations
- Full order management system:
  - Customer order tracking
  - Seller product-level order updates

## 🛠️ Tech Stack

| Category                          | Technologies                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| 🎨 **Frontend**                   | ⚛️ Next.js<br>🔷 TypeScript<br>🎨 Tailwind CSS<br>🧩 Shadcn UI<br>📝 Zod<br>⚛️ React Context API |
| 🔐 **Authentication & User Sync** | 🔐 Clerk Authentication<br>🔄 MongoDB User Synchronization                                       |
| 🖥️ **Backend**                    | 🛣️ Express.js<br>🟨 JavaScript                                                                   |
| 🛢️ **Database**                   | 🍃 MongoDB<br>🔗 Mongoose                                                                        |
| 💳 **Payments**                   | 💳 Stripe<br>🅿️ PayPal                                                                           |

## 📅 Project Structure:

The project follows a modular and scalable full-stack architecture, separating concerns between **frontend (Next.js)**, **backend (Node.js + Express)**, and **shared business logic**

```
market
├── README.md
├── client
│   ├── README.md
│   ├── components.json
│   ├── eslintrc.json
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── public
│   │   ├── assets
│   │   │   ├── icons
│   │   │   └── images
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── google.png
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── src
│   │   ├── api
│   │   │   ├── category.ts
│   │   │   ├── coupon.ts
│   │   │   ├── home.ts
│   │   │   ├── offer-tag.ts
│   │   │   ├── order.ts
│   │   │   ├── paypal.ts
│   │   │   ├── product.ts
│   │   │   ├── profile.ts
│   │   │   ├── review.ts
│   │   │   ├── size.ts
│   │   │   ├── store.ts
│   │   │   ├── stripe.ts
│   │   │   ├── subCategory.ts
│   │   │   └── user.ts
│   │   ├── app
│   │   │   ├── (auth)
│   │   │   ├── (store)
│   │   │   ├── api
│   │   │   ├── dashboard
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   └── layout.tsx
│   │   ├── cart-store
│   │   │   └── useCartStore.ts
│   │   ├── components
│   │   │   ├── Auth.tsx
│   │   │   ├── SignInOAuthButtons.tsx
│   │   │   ├── dashboard
│   │   │   ├── shared
│   │   │   ├── store
│   │   │   └── ui
│   │   ├── constants
│   │   │   ├── data.ts
│   │   │   └── icons.ts
│   │   ├── data
│   │   │   └── countries.json
│   │   ├── hooks
│   │   │   ├── use-mobile.ts
│   │   │   ├── useFromStore.ts
│   │   │   └── useImageLoader.js
│   │   ├── lib
│   │   │   ├── axios.ts
│   │   │   ├── schemas.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── middleware.ts
│   │   └── providers
│   │       ├── AuthProvider.tsx
│   │       └── modal-provider.tsx
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── types
│       ├── colorthief.d.ts
│       ├── react-awesome-slider-autoplay.d.ts
│       ├── react-image-zooom.d.ts
│       └── react-rating-stars-component.d.ts
└── server
    ├── app.js
    ├── controller
    │   ├── auth.controller.js
    │   ├── category.controller.js
    │   ├── coupon.controller.js
    │   ├── home.controller.js
    │   ├── offerTag.controller.js
    │   ├── order.controller.js
    │   ├── product.controller.js
    │   ├── profile.controller.js
    │   ├── review.controller.js
    │   ├── size.controller.js
    │   ├── store.controller.js
    │   ├── subCategory.controller.js
    │   └── user.controller.js
    ├── lib
    │   └── db.js
    ├── migration-scripts
    │   ├── countries.json
    │   └── seed-countries.js
    ├── models
    │   ├── cart.model.js
    │   ├── category.model.js
    │   ├── country.model.js
    │   ├── coupon.model.js
    │   ├── offerTag.model.js
    │   ├── order.model.js
    │   ├── product.model.js
    │   ├── store.model.js
    │   ├── subCategory.model.js
    │   ├── user.model.js
    │   └── wishlist.model.js
    ├── package-lock.json
    ├── package.json
    ├── routes
    │   ├── auth.route.js
    │   ├── category.route.js
    │   ├── coupon.routes.js
    │   ├── home.route.js
    │   ├── offerTag.route.js
    │   ├── order.route.js
    │   ├── product.route.js
    │   ├── profile.route.js
    │   ├── review.route.js
    │   ├── size.route.js
    │   ├── store.route.js
    │   ├── subCategory.route.js
    │   └── user.route.js
    ├── services
    │   ├── cart.service.js
    │   └── product.service.js
    └── utils
        ├── createProductVariant.js
        ├── generateUniqueSlug.js
        └── product.utils.js
```

### Root Directory

- **client/** – Frontend application built with Next.js and TypeScript.
- **server/** – Backend REST API built with Express.js and MongoDB.
- **README.md** – Project overview and setup instructions.

### Client (Frontend)

- **src/app/** – Next.js App Router containing all application routes, layouts, authentication pages, store pages, dashboard pages, and API routes.
- **src/components/** – Reusable UI components shared across the application, including dashboard, store, authentication, and Shadcn UI components.
- **src/api/** – Centralized API functions responsible for communicating with the backend services.
- **src/cart-store/** – Global cart state management logic.
- **src/providers/** – Application providers responsible for authentication, modals, and other global contexts.
- **src/hooks/** – Custom React hooks used throughout the application.
- **src/lib/** – Shared utilities, Axios configuration, TypeScript types, Zod validation schemas, and helper functions.
- **src/constants/** – Application constants, static data, and icon mappings.
- **public/** – Static assets such as images, icons, and publicly accessible files.
- **middleware.ts** – Route protection and request middleware logic.

### Server (Backend)

- **controller/** – Request handlers responsible for processing incoming requests and returning responses.
- **routes/** – Defines all API endpoints and connects them to their corresponding controllers.
- **models/** – Mongoose models representing the application's database collections.
- **services/** – Business logic layer for few selected features where the logic is kept separate from controllers used to keep controllers clean and reusable.
- **lib/db.js** – MongoDB database connection configuration.
- **utils/** – Helper utilities and reusable functions used across the backend.
- **migration-scripts/** – Scripts used to seed initial database data, such as countries with names and codes.

### Architecture Flow

Frontend (Next.js) → API Layer → Express Routes → Controllers → Services → Mongoose Models → MongoDB

## 🚀 Getting Started

🔗 Clone the repository:

```bash
git clone
```

## ⚙️ Installation & Setup

### 🔐 Environment Setup

Create environment configuration files for both client and server.

Create a `.env` file inside the `client` folder:
`client/.env`

```bash

NODE_ENV =
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_PRESET_NAME=
IPINFO_TOKEN=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_SECRET =
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
```

Create a `.env` file inside the `server` folder:
`server/.env`

```bash

MONGODB_URI=
PORT=
```

### 📦 Install dependencies (using npm, pnpm, or bun)

```bash
cd client && npm install

cd server && npm install
```

### 🚀 Run the project

```bash
cd client && npm run dev

cd server && npm run dev
```
