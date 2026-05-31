import { UserShippingAddressType } from "@/lib/types";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";

export default async function OrderUserDetailsCard({
  details,
}: {
  details: UserShippingAddressType;
}) {
  const {
    userId,
    firstName,
    lastName,
    address1,
    address2,
    city,
    country,
    phone,
    state,
    zip_code,
  } = details;

  const user = await currentUser();
  if (!user) return;

  return (
    <div>
      <section className="p-2 shadow-sm w-full">
        <div className="w-fit mx-auto">
          <Image
            src={user.imageUrl}
            alt="profile pic"
            width={100}
            height={100}
            className="rounded-full w-28 h-28 object-cover"
          />
        </div>
        <div className="text-main-primary mt-2 space-y-2">
          <h2 className="text-center font-bold text-2xl tracking-wide capitalize">
            {firstName} {lastName}
          </h2>
          <h6 className="text-center py-2 border-t border-neutral-400 border-dashed">
            {user.email}
          </h6>
          <h6 className="text-center">{phone}</h6>
          <p className="text-sm  py-2 border-t border-neutral-400 border-dashed">
            {address1}, {address2} ,{city} , {state}, {zip_code},{" "}
            {country?.name}
          </p>
        </div>
      </section>
    </div>
  );
}
