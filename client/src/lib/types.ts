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
  categoryId?: string;
  subCategoryId?: string;
  isSale: boolean;
  brand: string;
  sku: string;
  colors: { color: string }[];
  sizes: { size: string; quantity: number; price: number; discount: number }[];
  keywords: string[];
};

export type StoreProductType = {
  _id: string
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