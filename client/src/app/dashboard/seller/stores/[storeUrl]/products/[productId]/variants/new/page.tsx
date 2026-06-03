// Product Details form
import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/api/category";
import { getProductMainInfo } from "@/api/product";
import { getAllOfferTags } from '@/api/offer-tag';
import {getCountries} from "@/api/user";

export default async function SellerNewProductVariantPage({
  params,
}: {
  params: { storeUrl: string; productId: string };
}) {
  const categories = await getAllCategories();
  const product = await getProductMainInfo(params.productId);
  const offerTags = await getAllOfferTags();
  const countries = await getCountries();

  if (!product) return null;
  return (
    <div>
      <ProductDetails
        categories={categories}
        storeUrl={params.storeUrl}
        offerTags={offerTags}
        data={product}
        countries={countries}
      />
    </div>
  );
}