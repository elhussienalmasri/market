import PaymentsTable from "@/components/store/profile/payments/payments-table";
import { getUserPayments } from "@/api/profile";
import { auth } from "@clerk/nextjs/server";

export default async function ProfilePaymentPage() {
  const { getToken } = auth();
  const token = await getToken();

  if (!token) {
    console.error("You are not logged in");
    alert("You are not logged in");
    return;
  }

  const payments_data = await getUserPayments({ token });
  const { payments, totalPages } = payments_data;

  return (
    <div>
      <PaymentsTable payments={payments} totalPages={totalPages} />
    </div>
  );
}
