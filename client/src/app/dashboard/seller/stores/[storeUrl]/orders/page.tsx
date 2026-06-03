import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";

import { getStoreOrders } from "@/api/store";
import { auth } from "@clerk/nextjs/server";

export default async function SellerOrdersPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  const { getToken } = auth();

  const token = await getToken();

  const orders = await getStoreOrders(params.storeUrl, token);
  return (
    <div>
      <DataTable
        filterValue="id"
        data={orders}
        columns={columns}
        searchPlaceholder="Search order by id ..."
      />
    </div>
  );
}
