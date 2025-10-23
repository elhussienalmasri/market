// Product details form
import ProductDetails from "@/components/dashboard/forms/product-details";

import { getAllCategories } from "@/api/category";
import { getProductVariant } from "@/api/product";

import { getAllOfferTags } from "@/api/offer-tag";

export default async function ProductVariantPage({
  params,
}: {
  params: { storeUrl: string; productId: string; variantId: string };
}) {
  const categories = await getAllCategories();
  const offerTags = await getAllOfferTags();
  const { productId, variantId, storeUrl } = params;
  const productDetails = await getProductVariant(productId, variantId);
  if (!productDetails) return;
  return (
    <div>
      <ProductDetails
        categories={categories}
        offerTags={offerTags}
        storeUrl={storeUrl}
        data={productDetails}
      />
    </div>
  );
}