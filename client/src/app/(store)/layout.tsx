import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div>{children}</div>
      <Toaster position="top-center" />
    </div>
  );
}
