import ThemeToggle from "@/components/shared/theme-toggle";

import Auth from "@/components/Auth";

export default function Home() {
  return (
    <div className="p-5">
      <div className="w-100 flex gap-x-5 justify-end">
        <Auth />
        <ThemeToggle />
      </div>
      <h1 className=" text-blue-500 font-barlow">Home page</h1>
    </div>
  );
}

