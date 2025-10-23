import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserCountry } from "./lib/utils";

export default clerkMiddleware(async(auth, req, next) => {
  const protectedRoutes = createRouteMatcher(["/dashboard/(.*)"]);
   if (protectedRoutes(req)) auth().protect();

  let response = NextResponse.next();

  const countryCookie = req.cookies.get("userCountry");

  if (countryCookie) {
    
    response = NextResponse.next();
  } else {
    response = NextResponse.redirect(new URL(req.url));
    
    const userCountry = await getUserCountry();

  
    response.cookies.set("userCountry", JSON.stringify(userCountry), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return response;
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};