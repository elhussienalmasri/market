import StoreDefaultShippingDetails from "@/components/dashboard/forms/store-default-shipping-details";
import DataTable from "@/components/ui/data-table";
import {
  fetchStoreDefaultShippingDetails,
  fetchStoreShippingRates,
} from "@/api/store";
import { redirect } from "next/navigation";
import { columns } from "./columns";

export default async function SellerStoreShippingPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  const shippingDetails = await fetchStoreDefaultShippingDetails(params.storeUrl);
  const shippingRates = await fetchStoreShippingRates(params.storeUrl);
  if (!shippingDetails || !shippingRates) return redirect("/");
  return (
    <div>
      <StoreDefaultShippingDetails
        data={shippingDetails}
        storeUrl={params.storeUrl}
      />
      <DataTable
        filterValue="countryName"
        data={shippingRates}
        columns={columns}
        searchPlaceholder="Search by country name..."
      />
    </div>
  );
}