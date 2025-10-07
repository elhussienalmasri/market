import type { Metadata } from "next";
import { Inter, Barlow } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "next-themes";

import { ClerkProvider } from "@clerk/nextjs";

import AuthProvider from "../providers/AuthProvider";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const interFont = Inter({ subsets: ["latin"] });
const barlowFont = Barlow({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Market",
  description:
    "Market is your one-stop online destination for trusted products, seamless shopping, and everyday essentials."
};

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY; if (!PUBLISHABLE_KEY) { throw new Error("Missing Publishable Key"); }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <html lang="en">
        <body className={`${interFont.className} ${barlowFont.variable}`}>
         <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
             <Toaster />
            <SonnerToaster position="bottom-left" />
          </ThemeProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
