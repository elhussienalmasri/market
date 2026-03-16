import {
  getProductPageData
} from "@/api/product";

import countries from "@/data/countries.json";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

export type SubCategory = {
  _id: string;
  name: string;
  image?: string;
  url: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  _id: string;
  name: string;
  image: string;
  url: string;
  featured: boolean;
  subCategories?: SubCategory[];
  createdAt: Date;
  updatedAt: Date;
};

// Product + variant
export type ProductWithVariantType = {
  productId?: string;
  variantId: string;
  name: string;
  description?: string;
  variantName: string;
  variantDescription?: string;
  images: { url: string }[];
  variantImage: string;
  categoryId?: string;
  subCategoryId?: string;
  offerTagId?: string;
  isSale: boolean;
  saleEndDate?: string;
  brand: string;
  sku: string;
  weight?: number;
  colors: { color: string }[];
  sizes: { size: string; quantity: number; price: number; discount: number }[];
   product_specs: { name: string; value: string }[];
  variant_specs: { name: string; value: string }[];
  keywords: string[];
  questions: { question: string; answer: string }[];
};

export type StoreProductType = {
  _id: string;
  name: string;
  description?: string | null;
  brand?: string | null;
  slug?: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: {
    _id: string;
    name: string;
  };
  subCategoryId: {
    _id: string;
    name: string;
  };
  variants: {
    _id: string;
    variantName: string;
    variantDescription?: string | null;
    isSale: boolean;
    sku: string;
    keywords?: string;
    images: {
      id: string;
      url: string;
      alt?: string;
    }[];
    colors: {
      id: string;
      name: string;
    }[];
    sizes: {
      id: string;
      size: string;
      quantity: number;
      price: number;
      discount?: number;
    }[];
  }[];
  storeId: {
    id: string;
    url: string;
  };
};

export type StoreData = {
  _id: string;
  name: string;
  description?: string;
  email: string;
  phone: string;
  url: string;
  logo?: string;
  cover?: string;
  status: "PENDING" | "ACTIVE" | "BANNED" | "DISABLED";
  averageRating?: number;
  featured?: boolean;
  returnPolicy?: string;
  defaultShippingService?: string;
  defaultShippingFees?: number;
  defaultDeliveryTimeMin?: number;
  defaultDeliveryTimeMax?: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type OfferTag = {
  _id: string;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
};


export type CountryWithShippingRatesType = {
  countryId: string;
  countryName: string;
  shippingRate: ShippingRate;
};

export interface Country {
  _id: string;
  name: string;
  code: string;
  city: string;
  region: string;
}

export type SelectMenuOption = (typeof countries)[number];


export type VariantSimplified = {
  variantId: string;
  variantSlug: string;
  variantName: string;
  images: ProductVariantImage[];
  sizes: Size[];
};

export type VariantImageType = {
  url: string;
  image: string;
};

export type ProductVariantImage = {
  id: string;
  url: string;
  alt: string;
  order?: number;
  productVariantId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ShippingRate = {
  id: string;

  shippingService: string;
  shippingFeePerItem: number;
  shippingFeeForAdditionalItem: number;
  shippingFeePerKg: number;
  shippingFeeFixed: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  returnPolicy: string;

  countryId: string;
  storeId: string;

  createdAt: Date;
  updatedAt: Date;
};

export type Size = {
  id: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;

  productVariantId: string;

  createdAt: Date;
  updatedAt: Date;
};

export type StoreDefaultShippingType = {
  defaultShippingService: string;
  defaultShippingFeePerItem: number;
  defaultShippingFeeForAdditionalItem: number;
  defaultShippingFeePerKg: number;
  defaultShippingFeeFixed: number;
  defaultDeliveryTimeMin: number;
  defaultDeliveryTimeMax: number;
  returnPolicy: string;
} | null;

export type ProductType = {
  id: string;
  slug: string;
  name: string;
  rating: number;
  sales: number;
  variants: VariantSimplified[];
  variantImages: VariantImageType[];
};

export type Spec = {
  id: string;
  name: string;
  value: string;

  productId?: string | null;
  product?: ProductType | null;

  variantId?: string | null;
  variant?: ProductVariant | null;

  createdAt: Date;
  updatedAt: Date;
};

export type ReviewImage = {
  id: string;
  url: string;
  alt: string;

  reviewId: string;
  review: Review;

  createdAt: Date;
  updatedAt: Date;
};

export type Review = {
  id: string;
  variant: string;
  review: string;
  rating: number;
  color: string;
  size: string;
  quantity: string;
  likes: number;

  images: ReviewImage[];

  userId: string;
  user: User;

  productId: string;
  product: ProductType;

  createdAt: Date;
  updatedAt: Date;
};

enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SELLER = "SELLER",
}

export type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: Role;

  stores: StoreData[];
  following: StoreData[];
  reviews: Review[];
  cart?: Cart | null;
  shippingAddresses: ShippingAddress[];
  orders: Order[];
  wishlist: Wishlist[];
  payments: PaymentDetails[];
  coupons: Coupon[];

  createdAt: Date;
  updatedAt: Date;
};

export type Wishlist = {
  id: string;

  userId: string;
  user: User;

  productId: string;
  product: ProductType;

  variantId: string;
  variant: ProductVariant;

  sizeId?: string | null;
  size?: Size | null;

  createdAt: Date;
  updatedAt: Date;
};

export type ProductVariant = {
  id: string;
  variantName: string;
  variantDescription?: string | null;
  variantImage: string;
  slug: string;
  isSale: boolean;
  saleEndDate?: string | null;
  sku: string;
  keywords: string;
  sales: number;
  weight: number;

  productId: string;
  product: ProductType;

  sizes: Size[];
  images: ProductVariantImage[];
  colors: Color[];
  specs: Spec[];
  wishlist: Wishlist[];

  createdAt: Date;
  updatedAt: Date;
};

export type Color = {
  id: string;
  name: string;

  productVariantId: string;
  productVariant: ProductVariant;

  createdAt: Date;
  updatedAt: Date;
};

export type Coupon = {
  id: string;         
  code: string;
  startDate: string;
  endDate: string;
  discount: number;

  storeId: string;
  store: StoreData;

  orders?: OrderGroup[];
  users?: User[];
  carts?: Cart[];

  createdAt: Date;
  updatedAt: Date;
};

export type Cart = {
  id: string;
  userId: string;
  user: User;

  couponId?: string | null;
  coupon?: Coupon | null;

  cartItems: CartItem[];
  shippingFees: number;
  subTotal: number;
  total: number;

  createdAt: Date;
  updatedAt: Date;
};

export type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  sizeId: string;
  productSlug: string;
  variantSlug: string;
  sku: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
  shippingFee: number;
  totalPrice: number;

  cartId: string;
  cart: Cart;

  storeId: string;
  store: StoreData;

  createdAt: Date;
  updatedAt: Date;
};

enum OrderStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Processing = "Processing",
  Shipped = "Shipped",
  OutForDelivery = "OutforDelivery",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
  Failed = "Failed",
  Refunded = "Refunded",
  Returned = "Returned",
  PartiallyShipped = "PartiallyShipped",
  OnHold = "OnHold"
}

enum PaymentStatus {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed",
  Declined = "Declined",
  Cancelled = "Cancelled",
  Refunded = "Refunded",
  PartiallyRefunded = "PartiallyRefunded",
  Chargeback = "Chargeback"
}

enum PaymentMethod {
  Paypal = "Paypal",
  Stripe = "Stripe"
}

type PaymentDetails = {
  id: string; 

  paymentIntentId: string;
  paymentMethod: PaymentMethod; // enum
  status: PaymentStatus;        // enum
  amount: number;
  currency: string;

  orderId: string;
  order: Order;

  userId: string;
  user: User;

  createdAt: Date;
  updatedAt: Date;
};

enum ProductStatus {
  Pending = "Pending",                   // Product added, no action yet
  Processing = "Processing",             // Being prepared (picked, packed, manufactured)
  ReadyForShipment = "ReadyForShipment", // Packed, ready for shipment
  Shipped = "Shipped",                   // Shipped to customer
  Delivered = "Delivered",               // Delivered
  Canceled = "Canceled",                 // Order canceled
  Returned = "Returned",                 // Returned by customer
  Refunded = "Refunded",                 // Cost refunded
  FailedDelivery = "FailedDelivery",     // Delivery attempt failed
  OnHold = "OnHold",                     // On hold (stock/verification issues)
  Backordered = "Backordered",           // Delayed due to stock unavailability
  PartiallyShipped = "PartiallyShipped", // Some units shipped
  ExchangeRequested = "ExchangeRequested", // Customer requested exchange
  AwaitingPickup = "AwaitingPickup"      // Awaiting customer pickup
}

 type OrderItem = {
  id: string; 

  productId: string;
  variantId: string;
  sizeId: string;

  productSlug: string;
  variantSlug: string;
  sku: string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  shippingFee: number;
  price: number;
  totalPrice: number;

  orderGroupId: string;
  orderGroup: OrderGroup;

  status: ProductStatus; // enum

  createdAt: Date;
  updatedAt: Date;
};

export type OrderGroup = {
  id: string;
  status: OrderStatus;

  items: OrderItem[];

  shippingService: string;
  shippingDeliveryMin: number;
  shippingDeliveryMax: number;

  shippingFees: number;
  subTotal: number;
  total: number;

  orderId: string;
  order: Order;

  storeId: string;
  store: StoreData;

  couponId?: string | null;
  coupon?: Coupon | null;

  createdAt: Date;
  updatedAt: Date;
};

export type Order = {
  id: string;
  shippingFees: number;
  subTotal: number;
  total: number;

  groups: OrderGroup[];

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;

  paymentMethod?: PaymentMethod | null;
  paymentDetails?: PaymentDetails | null;

  shippingAddressId: string;
  shippingAddress: ShippingAddress;

  userId: string;
  user: User;

  createdAt: Date;
  updatedAt: Date;
};

export type ShippingAddress = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string | null;
  state: string;
  city: string;
  zip_code: string;
  default: boolean;

  orders: Order[];

  userId: string;
  user: User;

  countryId: string;
  country: Country;

  createdAt: Date;
  updatedAt: Date;
};

export type CartWithCartItemsType = Cart & {
  cartItems: CartItem[];
  coupon: (Coupon & { store: StoreData }) | null;
};

export type UserShippingAddressType = ShippingAddress & {
  country: Country;
  user: User;
};

export type VariantInfoType = {
  variantName: string;
  variantSlug: string;
  variantImage: string;
  variantUrl: string;
  images: ProductVariantImage[];
  sizes: Size[];
  colors: Partial<Color>[];
};

export type CartProductType = {
  productId: string;
  variantId: string;
  productSlug: string;
  variantSlug: string;
  name: string;
  variantName: string;
  image: string;
  variantImage: string;
  sizeId: string;
  size: string;
  quantity: number;
  price: number;
  stock: number;
  weight: number;
  shippingMethod: string;
  shippingService: string;
  shippingFee: number;
  extraShippingFee: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  isFreeShipping: boolean;
};

export type ProductPageDataType = Awaited<ReturnType<typeof getProductPageData>>;

export type RatingStatisticsType = {
  ratingStatistics: {
    rating: number;
    numReviews: number;
    percentage: number;
  }[];
  reviewsWithImagesCount: number;
  totalReviews: number;
};

export type ReviewsFiltersType = {
  rating?: number;
  hasImages?: boolean;
};

export type ReviewsOrderType = {
  orderBy: "latest" | "oldest" | "highest";
};

export type ReviewWithImageType = Review & {
  images: ReviewImage[];
  user: User;
};

export type StatisticsCardType = {
  rating: number;
  numReviews: number;
  percentage: number
}[];

export type ProductShippingDetailsType = {
  shippingFeeMethod: string;
  shippingService: string;
  shippingFee: number;
  extraShippingFee: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  returnPolicy: string;
  countryCode: string;
  countryName: string;
  city: string;
  isFreeShipping: boolean;
};