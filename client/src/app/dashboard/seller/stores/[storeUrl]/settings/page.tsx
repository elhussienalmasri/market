
import StoreDetails from "@/components/dashboard/forms/store-details";

import { fetchStoreByUrl } from "@/queries/store";
import { redirect } from "next/navigation";

export default async function SellerStoreSettingsPage({
  params,
}: {
  params: { storeUrl: string };
}) {

  const storeDetails = await fetchStoreByUrl(params.storeUrl)
  if (!storeDetails) redirect("/dashboard/seller/stores");
  return (
    <div>
      <StoreDetails data={storeDetails} />
    </div>
  );
}