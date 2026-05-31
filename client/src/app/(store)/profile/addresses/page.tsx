import AddressContainer from "@/components/store/profile/addresses/container";
import { getUserShippingAddresses, getCountries} from "@/api/user";
import { auth } from "@clerk/nextjs/server";

export default async function ProfileAddressesPage() {
  const { getToken } = auth();
    const token = await getToken();

  if (!token) {
    console.error("You are not logged in");
    alert("You are not logged in");
    return;
  }
  
  const addresses = await getUserShippingAddresses(token);
  const countries = await getCountries();
  return (
    <div>
      <AddressContainer addresses={addresses} countries={countries} />
    </div>
  );
}