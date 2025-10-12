// storeApi.ts or storeApi.js
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
