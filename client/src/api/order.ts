"use server";

import { axiosInstance } from "@/lib/axios";
import { ProductStatus, OrderStatus } from "@/lib/types";

export const getOrder = async (orderId: string) => {
  try {
    const { data } = await axiosInstance.get(`/order/${orderId}`);
    return data;
  } catch (error: any) {
    console.error("Order API Error:", error.response?.data || error.message);
    return null;
  }
};

export const updateOrderGroupStatus = async (
  storeId: string,
  groupId: string,
  status: OrderStatus,
  token?: string | null,
) => {
  const { data } = await axiosInstance.patch(
    `/order/${storeId}/${groupId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

export const updateOrderItemStatus = async (
  storeId: string,
  orderItemId: string,
  status: ProductStatus,
  token?: string | null,
) => {
  try {
    const response = await axiosInstance.patch(
      `/order/${storeId}/order-items/${orderItemId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to update order item status",
    );
  }
};
