"use server";

import { axiosInstance } from "@/lib/axios";
import { StoreData } from "@/lib/types";
import { StoreStatus } from "@/lib/types";

// Function: upsertStore
// Description: Sends store data to backend to create or update store
// Params: storeData - object containing store fields
export const upsertStore = async (
  storeData: Partial<StoreData>,
  token: string,
) => {
  try {
    const response = await axiosInstance.post("stores/upsert", storeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error, "error upserting store");
    throw error;
  }
};

export const fetchStoresByUser = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`stores/${userId}`);
    return response.data; // returns array of stores
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};

export const fetchStoreByUrl = async (storeUrl: string) => {
  try {
    const response = await axiosInstance.get(`/stores/url/${storeUrl}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching store details:", error);
    throw error;
  }
};

export async function fetchStoreDefaultShippingDetails(storeUrl: string) {
  try {
    const response = await axiosInstance.get(
      `stores/${storeUrl}/shipping-defaults`,
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching store shipping details:",
      error.response?.data?.error || error.message,
    );
    throw error;
  }
}

export async function updateStoreDefaultShippingDetails(
  storeUrl: string,
  shippingDetails,
  token: string,
) {
  try {
    const response = await axiosInstance.put(
      `/stores/${storeUrl}/shipping`,
      shippingDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating store shipping details:",
      error.response?.data?.error || error.message,
    );
    throw error;
  }
}

export async function fetchStoreShippingRates(storeUrl: string) {
  try {
    const response = await axiosInstance.get(
      `/stores/${storeUrl}/shipping-rates`,
    );

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || "Failed to fetch shipping rates.";
    console.error("Error fetching shipping rates:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function upsertShippingRate(
  storeUrl: string,
  shippingRate,
  token: string,
) {
  try {
    const response = await axiosInstance.put(
      `/stores/${storeUrl}/shipping-rates`,
      shippingRate,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || "Failed to update shipping rate.";
    console.error("Error upserting shipping rate:", errorMessage);
    throw new Error(errorMessage);
  }
}

export const getStoreOrders = async (
  storeUrl: string,
  token?: string | null,
) => {
  try {
    const { data } = await axiosInstance.get(`/stores/orders/${storeUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error: any) {
    console.error(
      "Error fetching store orders:",
      error?.response?.data || error.message,
    );
    throw new Error(
      error?.response?.data?.message || "Failed to fetch store orders",
    );
  }
};

export const applySeller = async (
  store: Partial<StoreData>,
  token: string | null,
) => {
  const { data } = await axiosInstance.post("/stores/apply-seller", store, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.store;
};

export const getAllStores = async (
  token: string | null,
): Promise<StoreData[]> => {
  const { data } = await axiosInstance.get("/stores/admin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.stores;
};

export const updateStoreStatus = async (
  payload: {
    storeId: string;
    status: StoreStatus;
  },
  token: string | null,
): Promise<StoreStatus> => {
  const { data } = await axiosInstance.patch("/stores/admin/status", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.status;
};

export const deleteStore = async (storeId: string, token: string | null) => {
  const { data } = await axiosInstance.delete(`/stores//admin/${storeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.store;
};

export const getStorePageDetails = async (
  storeUrl: string,
): Promise<Partial<StoreData>> => {
  try {
    const { data } = await axiosInstance.get(`/stores/user/${storeUrl}`);

    return data.store;
  } catch (error) {
    console.error("Error fetching store details:", error);
    throw error;
  }
};
