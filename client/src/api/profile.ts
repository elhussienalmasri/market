"use server";

import { axiosInstance } from "@/lib/axios";
import {
  OrderTableDateFilter,
  OrderTableFilter,
  PaymentTableDateFilter,
  PaymentTableFilter,
  ReviewDateFilter,
  ReviewFilter,
} from "@/lib/types";

export const getUserOrders = async ({
  filter = "",
  period = "",
  search = "",
  page = 1,
  pageSize = 10,
  token,
}: {
  filter?: OrderTableFilter;
  period?: OrderTableDateFilter;
  search?: string;
  page?: number;
  pageSize?: number;
  token?: string;
}) => {
  try {
    const { data } = await axiosInstance.get("/order/user-orders", {
      params: {
        filter,
        period,
        search,
        page,
        pageSize,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error: any) {
    console.error(
      "Get User Orders API Error:",
      error.response?.data || error.message,
    );

    return null;
  }
};

export const getUserPayments = async ({
  filter = "",
  period = "",
  search = "",
  page = 1,
  pageSize = 10,
  token,
}: {
  filter?: PaymentTableFilter;
  period?: PaymentTableDateFilter;
  search?: string;
  page?: number;
  pageSize?: number;
  token?: string;
}) => {
  try {
    const response = await axiosInstance.get("/profile/payments", {
      params: {
        filter,
        period,
        search,
        page,
        pageSize,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

export const getUserReviews = async (
  filter: ReviewFilter = "",
  period: ReviewDateFilter = "",
  search = "",
  page: number = 1,
  pageSize: number = 10,
  token?: string,
) => {
  try {
    const response = await axiosInstance.get("/profile/reviews", {
      params: {
        filter,
        period,
        search,
        page,
        pageSize,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw error.response?.data || error;
  }
};

export const getUserWishlist = async (
  page: number = 1,
  pageSize: number = 10,
  token?: string,
) => {
  try {
    const response = await axiosInstance.get("/profile/wishlist", {
      params: {
        page,
        pageSize,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw error.response?.data || error;
  }
};

export const getUserFollowedStores = async (
  page: number = 1,
  pageSize: number = 10,
  token?: string,
) => {
  try {
    const response = await axiosInstance("/profile/followed-stores", {
      params: {
        page,
        pageSize,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw error.response?.data || error;
  }
};
