import { getAllStores } from "@/api/store";
import { auth } from "@clerk/nextjs/server";
import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";

export default async function AdminStoresPage() {
  const { getToken } = auth();
  const token = await getToken();
  const stores = await getAllStores(token);

  return (
    <DataTable
      filterValue="name"
      data={stores}
      searchPlaceholder="Search store name..."
      columns={columns}
    />
  );
}
