"use server";

import { axiosInstance } from "@/lib/axios";

// =========================
// UPSERT COUPON
// =========================

export const upsertCoupon = async (
  coupon: any,
  storeUrl: String,
  token?: String,
) => {
  try {
    const response = await axiosInstance.post(
      "/coupons/upsert",
      {
        coupon,
        storeUrl,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Upsert coupon error:", error);
    return null;
  }
};

// =========================
// GET STORE COUPONS
// =========================

export const getStoreCoupons = async (storeUrl: String, token?: String) => {
  try {
    const response = await axiosInstance.get(`/coupons/store/${storeUrl}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Get store coupons error:", error);
    return [];
  }
};

// =========================
// GET SINGLE COUPON
// =========================

export const getCoupon = async (couponId: string) => {
  try {
    const response = await axiosInstance.get(`/coupons/${couponId}`);

    return response.data.coupon;
  } catch (error) {
    console.error("Get coupon error:", error);
    return null;
  }
};

// =========================
// DELETE COUPON
// =========================

export const deleteCoupon = async (
  couponId: string,
  storeUrl: string,
  token?: string,
) => {
  try {
    const response = await axiosInstance.delete(
      `/coupons/${storeUrl}/${couponId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Delete coupon error:", error);
    return null;
  }
};

// =========================
// APPLY COUPON
// =========================

export const applyCoupon = async (
  couponCode: string,
  cartId: string,
  token?: string,
) => {
  try {
    const response = await axiosInstance.post(
      "/coupons/apply",
      {
        couponCode,
        cartId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Apply coupon error:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};