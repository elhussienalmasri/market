import { ReactNode } from "react";
import Footer from "@/components/store/layout/footer/footer";
import { Toaster } from "react-hot-toast";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div>{children}</div>
      <div className="h-96"></div>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
