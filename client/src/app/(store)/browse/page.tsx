import Header from "@/components/store/layout/header/header";
import ProductList from "@/components/store/shared/product-list";
import { FiltersQueryType } from "@/lib/types";
import { fetchProducts } from "@/api/product";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: FiltersQueryType;
}) {
  const { category, offer, search, size, sort, subCategory } = searchParams;
  const products_data = await fetchProducts({
    page: 1,
    pageSize: 12,
    sortBy: sort,
    filters: {
      search,
      category,
      subCategory,
      offer,
      size: Array.isArray(size)
        ? size
        : size
          ? [size] // Convert single size string to array
          : undefined, // If no size, keep it undefined
    },
  });
  const { products } = products_data;

  return (
    <>
      <Header />
      <div className="max-w-[95%] mx-auto">
        <div className="flex mt-5 gap-x-5">
          <div className="p-4 space-y-5">
            <ProductList products={products} />
          </div>
        </div>
      </div>
    </>
  );
}
