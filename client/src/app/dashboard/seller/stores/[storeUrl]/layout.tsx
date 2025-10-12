
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";

import { currentUser } from "@clerk/nextjs/server";

import { fetchStoresByUser } from "@/queries/store";

export default async function SellerStoreDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Fetch the current user. If the user is not authenticated, redirect them to the home page.
  const user = await currentUser();
  if (!user) {
    redirect("/");
    return; // Ensure no further code is executed after redirect
  }

  const stores = await fetchStoresByUser(user.id)

  return (
    <div className="h-full w-full flex">
      <Sidebar stores={stores} />
      <div className="w-full ml-[300px]">
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
}