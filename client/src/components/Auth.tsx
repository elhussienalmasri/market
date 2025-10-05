"use client";

import { SignedOut, UserButton } from "@clerk/nextjs";
import SignInOAuthButtons from "./SignInOAuthButtons";

const Auth = () => {

  return (
    <div className="flex items-center gap-4">

      <SignedOut>
        <SignInOAuthButtons />
      </SignedOut>

      <UserButton />
    </div>
  );
};

export default Auth;
