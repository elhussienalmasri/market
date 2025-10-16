"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import DataTable from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import CategoryDetails from "@/components/dashboard/forms/category-details";
import { getColumns } from "./columns"; // make sure columns export is function

import { Category } from "./columns"; 

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  async function fetchCategories() {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = getColumns(fetchCategories); // always an array

  if (!categories || !Array.isArray(categories)) return null;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} /> Create category
        </>
      }
      modalChildren={<CategoryDetails />}
      newTabLink="/dashboard/admin/categories/new"
      filterValue="name"
      data={categories}
      searchPlaceholder="Search category name..."
      columns={columns} // must be array
    />
  );
}