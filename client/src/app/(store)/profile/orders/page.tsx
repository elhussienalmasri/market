import OrdersTable from "@/components/store/profile/orders/orders-table";
import { getUserOrders } from "@/api/profile";
import { auth } from "@clerk/nextjs/server";

export default async function ProfileOrdersPage() {
  const { getToken } = auth();
  const token = await getToken();

  if (!token) {
    console.error("You are not logged in");
    alert("You are not logged in");
    return;
  }

  const orders_data = await getUserOrders({ token });
  const { orders, totalPages } = orders_data;

  return (
    <div>
      <OrdersTable orders={orders} totalPages={totalPages} />
    </div>
  );
}
