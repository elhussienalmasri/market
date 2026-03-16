import { axiosInstance } from "@/lib/axios";
import { ProductWithVariantType } from "@/lib/types";

/**
 * @function upsertProduct
 * 
 * Creates or updates a product and its associated variant, including images, colors, and sizes.
 * Access Level: Seller Only
 * 
 * This function checks if the product already exists. If it does, it adds a new variant.
 * If it doesn’t exist, it creates a new product first, then a linked variant.
 * 
 * Each variant automatically generates related image, color, and size documents
 * and links them using ObjectId references. All documents are stored atomically.
 */
export const upsertProduct = async ( product: ProductWithVariantType, storeUrl:  string, token:string ) => {
  try {
    const response = await axiosInstance.post(
      `product/upsert/${storeUrl}`,
      {product},
      
      {
        headers: {
          Authorization: `Bearer ${token}`, // token for Clerk Auth
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error upserting product:",  error);
    throw error;
  }
};

// Function: getProductVariant
// Description: Fetch details of a specific product variant (Public)

export const getProductVariant = async (productId:string, variantId:string) => {
  try {
    const response = await axiosInstance.get(`/product/${productId}/variant/${variantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product variant:", error);
    throw error;
  }
};

// Function: getProductMainInfo
// Description: Fetch main information of a specific product (Public)
export const getProductMainInfo = async (productId:string) => {

  try {
    const response = await axiosInstance.get(`/product/${productId}/info`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product main info:", error);
    throw error;
  }
};

// Function: getAllStoreProducts
// Description: Fetch all products for a given store URL (Public)
export const getAllStoreProducts = async (storeUrl:string) => {
  try {
    const response = await axiosInstance.get(`/product/${storeUrl}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching store products:", error);
    throw error;
  }
};

// Function: deleteProduct
// Description: Delete a product by ID (Seller only)
export const deleteProduct = async (productId:string) => {
  try {
    const response = await axiosInstance.delete(`/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

/**
 * Fetches products with filters, sorting, and pagination.
 * 
 * @param {Object} options - Options for filters and pagination.
 * @param {number} options.page - Current page number.
 * @param {number} options.pageSize - Number of products per page.
 * @param {string} options.sortBy - Sorting option (e.g. "topRated", "newArrivals").
 * @param {Object} options.filters - Object containing filters like category, brand, color, etc.
 * @returns {Promise<Object>} The response containing products and pagination info.
 */
export const fetchProducts = async ({ page = 1, pageSize = 10, sortBy = '', filters = {} }) => {
  try {
    const params = {
      page,
      pageSize,
      sortBy,
      ...filters
    };

    const response = await axiosInstance.get(`/product`, { params });

    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductPageData = async (
  productSlug: string,
  variantSlug: string,
  token: string
) => {
  try {
    const response = await axiosInstance.get(
      `/product/${productSlug}/${variantSlug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error, "error fetching product page data");
    throw error;
  }
};

export const getProductFilteredReviews = async (
  productId: string,
  filters?: {
    rating?: number;
    hasImages?: boolean;
    orderBy?: string;
    page?: number;
    pageSize?: number;
  }
) => {

  try {
    const response = await axiosInstance.get(`/product/reviews/${productId}`, {
      params: filters, // automatically adds rating, hasImages, orderBy, page…
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    throw error;
  }
};

export const getProductBySlug = async (
  productSlug: string,
  token?: string
) => {
  try {
    const response = await axiosInstance.get(
      `/products/${productSlug}`,
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      }
    );

    return response.data;
  } catch (error) {
    console.error("error fetching product", error);
    throw error;
  }
};