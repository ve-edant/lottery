"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
  const { isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Check if the route starts with /lottery/
  const isLottery = pathname.startsWith("/lottery");

  // Dynamic classes
  const headerClass = isLottery
    ? "bg-gradient-to-r from-[#f95959] to-[#ff988d]"
    : "bg-white";

  const logoClass = isLottery ? "text-white" : "text-[#f95959]";

  const loginBtnClass = isLottery
    ? "text-white border border-white bg-transparent hover:bg-white hover:text-[#f95959] rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"
    : "text-[#f95959] border border-[#f95959] bg-white hover:bg-[#f95959] hover:text-white hover:border-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer";

  const signUpBtnClass = isLottery
    ? "bg-white text-[#f95959] hover:bg-transparent hover:text-white border hover:border-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"
    : "bg-[#f95959] text-white hover:bg-white hover:text-[#f95959] border hover:border-[#f95959] rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer";

  if (!isLoaded) {
    return (
      <nav
        className={`${headerClass} w-full px-6 py-4 flex justify-between items-center`}
      >
        <div className="h-6 w-32 bg-zinc-300/50 rounded animate-pulse" />
        <div className="flex gap-4">
          <div className="h-8 w-8 bg-zinc-300/50 rounded-full animate-pulse" />
          <div className="h-8 w-20 bg-zinc-300/50 rounded animate-pulse" />
        </div>
      </nav>
    );
  }

  return (
    <header
      className={`${headerClass} flex justify-between items-center p-4 h-16 w-full`}
    >
      {/* Left: Logo */}
      <div className={`text-xl font-bold ${logoClass}`}>MyLogo</div>

      {/* Right: Auth Buttons */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className={loginBtnClass}>Login</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className={signUpBtnClass}>Sign Up</button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8 sm:w-10 sm:h-10",
                userButtonPopoverCard: "w-56",
                userButtonActionButton: "text-sm",
              },
            }}
          />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
