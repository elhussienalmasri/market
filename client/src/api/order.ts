"use server";

import { axiosInstance } from "@/lib/axios";

export const getOrder = async (orderId: string) => {
  try {
    const { data } = await axiosInstance.get(`/order/${orderId}`);
    return data;
  } catch (error: any) {
    console.error("Order API Error:", error.response?.data || error.message);
    return null;
  }
};
