import CheckoutContainer from "@/components/store/checkout-page/container";
import { getUserCart, getCountries } from "@/api/user";
import { getUserShippingAddresses } from "@/api/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { useSession } from "@clerk/nextjs";

export default async function CheckoutPage() {
  const user = await currentUser();
  const { session } = useSession();
  if (!user) redirect("/cart");

  if (!session) {
    console.error("User not logged in");
    return;
  }

  const token = await session.getToken();

  if (!token) {
    console.error("You are not logged in");
    alert("You are not logged in");
    return;
  }

  const cart = await getUserCart(token)

  if (!cart) redirect("/cart");

  const addresses = await getUserShippingAddresses(token);

  const countries = await getCountries(token);
  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="max-w-conatiner mx-auto py-5 px-2">
        <CheckoutContainer
          cart={cart}
          countries={countries}
          addresses={addresses}
        />
      </div>
    </div>
  );
}