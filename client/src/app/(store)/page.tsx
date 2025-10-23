import ProductList from "@/components/store/shared/product-list";

import { fetchProducts } from "@/api/product";

export default async function HomePage() {
  const productsData = await fetchProducts({  page :1,
  pageSize :10,
  sortBy : '',
  filters: {},});
  const { products } = productsData;
  return (
    <div className="p-14">
      <ProductList products={products} title="Products" arrow />
    </div>
  );
}