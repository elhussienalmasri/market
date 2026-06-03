import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/api/category";
import { getAllOfferTags } from "@/api/offer-tag";
import { getCountries } from "@/api/user";

export default async function SellerNewProductPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  const categories = await getAllCategories();
  const offerTags = await getAllOfferTags();
  const countries = await getCountries();
  return (
    <div className="w-full">
      <ProductDetails
        categories={categories}
        storeUrl={params.storeUrl}
        offerTags={offerTags}
        countries={countries}
      />
    </div>
  );
}
