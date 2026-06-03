import { axiosInstance } from "@/lib/axios";
import { SizeFilters } from "@/lib/types";

export const getFilteredSizes = async (filters: SizeFilters, limit: number) => {
  try {
    const { data } = await axiosInstance.get("/sizes", {
      params: {
        ...filters,
        limit,
      },
    });
    return data;
  } catch (error: any) {
    console.error(
      "Error fetching sizes:",
      error?.response?.data || error.message,
    );
    throw new Error(error?.response?.data?.message || "Failed to fetch sizes");
  }
};
