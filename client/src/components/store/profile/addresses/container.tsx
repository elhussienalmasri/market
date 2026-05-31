"use client";
import { UserShippingAddressType, Country, ShippingAddress } from "@/lib/types";
import { FC, useState } from "react";
import UserShippingAddresses from "../../shared/shipping-addresses/shipping-addresses";

interface Props {
  addresses: UserShippingAddressType[];
  countries: Country[];
}

const AddressContainer: FC<Props> = ({ addresses, countries }) => {
  const [selectedAddress, setSelectedAddress] =
    useState<ShippingAddress | null>(null);
  return (
    <div className="w-full">
      <UserShippingAddresses
        addresses={addresses}
        countries={countries}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
    </div>
  );
};

export default AddressContainer;
