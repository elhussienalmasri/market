import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";
import { getAllCategories } from "@/api/category";

export default async function AdminNewSubCategoryPage() {
  const categories = await getAllCategories();
  return <SubCategoryDetails categories={categories} />;
}