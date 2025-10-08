"use server";

import { axiosInstance } from "@/lib/axios";
import { currentUser } from "@clerk/nextjs/server";

/**
 * upsertCategory
 * ----------------
 * Description: Sends category data to Express API for creation or update (upsert).
 * Permission: Only Admin users.
 *
 * @param {Object} category - Category object containing { id, name, image, url, featured, createdAt, updatedAt }
 * @returns {Promise<Object>} - Newly created or updated category
 */
export const upsertCategory = async (category: any) => {
  try {
    //  Verify current user using Clerk
    const user = await currentUser();

    if (!user) throw new Error("Unauthenticated.");

    //  Check admin role
    if (user.privateMetadata.role !== "ADMIN") {
      throw new Error("Unauthorized Access: Admin Privileges Required for Entry.");
    }

    //  Validate input
    if (!category) throw new Error("Please provide category data.");

    // Call Express API using Axios
    const response = await axiosInstance.post("/categories/upsert", category, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(" upsertCategory error:", error.response?.data || error.message);

    // Throw the backend error message if available
    throw new Error(error.response?.data?.error || error.message);
  }
};


export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get("/categories"); // Adjust API path if needed
    return response.data; // Return the array of categories
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};