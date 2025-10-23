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