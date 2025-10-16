'use server';

import { axiosInstance } from '@/lib/axios';
import { ProductWithVariantType } from "@/lib/types";

/**
 * Get a single OfferTag by ID.
 * @param {string} id
 */
export const getOfferTag = async (id: string) => {
  try {
    if (!id) throw new Error('OfferTag ID is required');

    const response = await axiosInstance.get(`/offer-tags/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in getOfferTag:', error);
  }
};

/**
 * Create or update an OfferTag (admin only).
 * @param {Partial<ProductWithVariantType>} offerTagData
 * @param {string} token
 */
export const upsertOfferTag = async (offerTagData: Partial<ProductWithVariantType>, token: string) => {
  try {
    // if (!offerTagData || typeof offerTagData !== 'object') {
    //   throw new Error('OfferTag data is required');
    // }

    const response = await axiosInstance.post(
      '/offer-tags/upsert',
      offerTagData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // token for Clerk Auth
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error?.message || "Failed to upsert offer tag");
  }
};

/**
 * Delete an OfferTag by ID (admin only).
 * @param {string} id
 * @param {string} token
 */
export const deleteOfferTag = async (id: string, token: string) => {
  try {
    if (!id) throw new Error('OfferTag ID is required');

    const response = await axiosInstance.delete(`/offer-tags/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // token for Clerk Auth
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error?.message || 'Failed to delete offer tag');
  }
};

/**
 * Get all offer tags (optional for listing).
 */
export const getAllOfferTags = async () => {
  try {
    const response = await axiosInstance.get('/offer-tags');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error?.message || 'Failed to fetch offer tags');
  }
};
