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