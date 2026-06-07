"use server";

import { axiosInstance } from "@/lib/axios";
import { ProductType, SimpleProduct } from "@/lib/types";

type FormatType = "simple" | "full";

type Param = {
  property: "category" | "subCategory" | "offer";
  value: string;
  type: FormatType;
};

type OfferKey = "best-deals" | "super-deals" | "user-card" | "featured";

type HomeProductsResponse = Record<OfferKey, SimpleProduct[] | ProductType[]>;

export const getHomeProducts = async (
  params: Param[],
): Promise<HomeProductsResponse> => {
  try {
    const res = await axiosInstance.post("/home/home-products", {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching home products:", error);
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to fetch home products",
    );
  }
};

export const getHomeFeaturedCategories = async () => {
  try {
    const res = await axiosInstance.get("/home/categories/featured");
    return res.data;
  } catch (error) {
    console.error("Error fetching featured categories:", error);
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to fetch featured categories",
    );
  }
};
