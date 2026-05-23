"use client";

import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import { getStoreCoupons } from "@/api/coupon";
import CouponDetails from "@/components/dashboard/forms/coupon-details";

import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function SellerCouponsPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  useEffect(() => {
    async function fetchCoupons() {
      try {
        if (!session) {
          console.error("User not logged in");
          return;
        }

        const token = await session.getToken();

        const data = await getStoreCoupons(params.storeUrl, token);

        setCoupons(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCoupons();
  }, [session, params.storeUrl]);
  return (
    <div>
      {loading ? (
        <div>loading...</div>
      ) : (
        <DataTable
          actionButtonText={
            <>
              <Plus size={15} />
              Create coupon
            </>
          }
          modalChildren={<CouponDetails storeUrl={params.storeUrl} />}
          newTabLink={`/dashboard/seller/stores/${params.storeUrl}/coupons/new`}
          filterValue="name"
          data={coupons}
          columns={columns}
          searchPlaceholder="Search coupon ..."
        />
      )}
    </div>
  );
}
