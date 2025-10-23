"use server";

import { axiosInstance } from "@/lib/axios";
import { StoreData } from "@/lib/types";


// Function: upsertStore
// Description: Sends store data to backend to create or update store
// Params: storeData - object containing store fields
export const upsertStore = async (storeData: Partial<StoreData>, token: string) => {
  try {
    const response = await axiosInstance.post(
      "stores/upsert",
      storeData,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error, "error upserting store");
    throw error;
  }
};

export const fetchStoresByUser = async (userId:string) => {
  
  try {
    const response = await axiosInstance.get(`stores/${userId}`);
    return response.data; // returns array of stores
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};

export const fetchStoreByUrl = async (storeUrl:string) => {
  try {
    const response = await axiosInstance.get(`/stores/url/${storeUrl}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching store details:", error);
    throw error;
  }
};

export async function fetchStoreDefaultShippingDetails(storeUrl:string) {
  try {
    const response = await axiosInstance.get(`stores/${storeUrl}/shipping-defaults`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching store shipping details:', error.response?.data?.error || error.message);
    throw error;
  }
}

export async function updateStoreDefaultShippingDetails(storeUrl: string, shippingDetails,token: string) {
  try {
    const response = await axiosInstance.put(
      `/stores/${storeUrl}/shipping`,
      shippingDetails,
       {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error updating store shipping details:', error.response?.data?.error || error.message);
    throw error;
  }
}

export async function fetchStoreShippingRates(storeUrl:string) {
  try {
    const response = await axiosInstance.get(`/stores/${storeUrl}/shipping-rates`);

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || 'Failed to fetch shipping rates.';
    console.error('Error fetching shipping rates:', errorMessage);
    throw new Error(errorMessage);
  }
}

export async function upsertShippingRate(storeUrl: string, shippingRate,token:string) {
  try {
    const response = await axiosInstance.put(
      `/stores/${storeUrl}/shipping-rates`,
      shippingRate,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || 'Failed to update shipping rate.';
    console.error('Error upserting shipping rate:', errorMessage);
    throw new Error(errorMessage);
  }
}