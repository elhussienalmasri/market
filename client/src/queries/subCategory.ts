import { axiosInstance } from "@/lib/axios";


/**
 *  Get all subcategories
 */
export const getAllSubCategories = async () => {
  const res = await axiosInstance.get("/subcategories");
  return res.data;
};


/**
 *  Get single subcategory by ID
 * @param id SubCategory ID
 */
export const getSubCategory = async (id: string) => {
  const res = await axiosInstance.get(`/subcategories/${id}`);
  return res.data;
};

/**
 * Upsert subcategory (create or update)
 * @param subCategory SubCategory data
 */
export const upsertSubCategory = async (subCategory: any) => {
  const res = await axiosInstance.post("/subcategories", subCategory);
  return res.data;
};

/**
 * Delete subcategory by ID
 * @param id SubCategory ID
 */
export const deleteSubCategory = async (id: string) => {
  const res = await axiosInstance.delete(`/subcategories/${id}`);
  return res.data;
};
