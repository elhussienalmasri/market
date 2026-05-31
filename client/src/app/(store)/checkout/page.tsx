import CheckoutContainer from "@/components/store/checkout-page/container";
import Header from "@/components/store/layout/header/header";
import { getUserCart, getCountries } from "@/api/user";
import { getUserShippingAddresses } from "@/api/user";
import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { Country } from "@/lib/types";

// Get cookies from the store
const cookieStore = cookies();
const userCountryCookie = cookieStore.get("userCountry");

// Set default country if cookie is missing
let userCountry: Country = {
  name: "United States",
  city: "",
  code: "US",
  region: "",
};

// If cookie exists, update the user country
if (userCountryCookie) {
  userCountry = JSON.parse(userCountryCookie.value) as Country;
}

export default async function CheckoutPage() {
  const user = await currentUser();
  const { getToken, userId } = auth();
  if (!userId) redirect("/cart");

  const token = await getToken();

  if (!token) {
    console.error("You are not logged in");
    alert("You are not logged in");
    return;
  }

  const cart = await getUserCart(token);

  if (!cart) redirect("/cart");

  const addresses = await getUserShippingAddresses(token);

  const countries = await getCountries();

  return (
    <>
      <Header />
      <div className="bg-[#f4f4f4] min-h-[calc(100vh-65px)]">
        <div className="max-w-container mx-auto py-5 px-2">
          <CheckoutContainer
            cart={cart.data}
            countries={countries}
            addresses={addresses}
            userCountry={userCountry}
          />
        </div>
      </div>
    </>
  );
}
