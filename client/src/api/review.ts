import { axiosInstance } from "@/lib/axios";
import { ReviewDetailsType, ReviewWithImageType } from "@/lib/types";

export const upsertReview = async (
  productId: string,
  review: ReviewDetailsType,
  token: string | null,
): Promise<ReviewWithImageType> => {
  const { data } = await axiosInstance.post<ReviewWithImageType>(
    `/review/${productId}/`,
    { review },
    {
      headers: {
        Authorization: `Bearer ${token}`, // token for Clerk Auth
      },
    },
  );

  return data;
};
