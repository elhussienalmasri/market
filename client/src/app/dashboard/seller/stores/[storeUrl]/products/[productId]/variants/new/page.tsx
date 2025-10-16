// Product Details form
import ProductDetails from "@/components/dashboard/forms/product-details";

import { getAllCategories } from "@/queries/category";
import { getProductMainInfo } from "@/queries/product";
import { getAllOfferTags } from '@/queries/offer-tag';

export default async function SellerNewProductVariantPage({
  params,
}: {
  params: { storeUrl: string; productId: string };
}) {
  const categories = await getAllCategories();
  const product = await getProductMainInfo(params.productId);
  const offerTags = await getAllOfferTags();

  if (!product) return null;
  return (
    <div>
      <ProductDetails
        categories={categories}
        storeUrl={params.storeUrl}
        offerTags={offerTags}
        data={product}
      />
    </div>
  );
}