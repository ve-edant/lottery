"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import React from "react";

const Navbar = () => {
    const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    // 👇 Skeleton UI while loading
    return (
      <nav className="w-full px-6 py-4 bg-zinc-900 flex justify-between items-center">
        <div className="h-6 w-32 bg-zinc-700 rounded animate-pulse" />
        <div className="flex gap-4">
          <div className="h-8 w-8 bg-zinc-700 rounded-full animate-pulse" />
          <div className="h-8 w-20 bg-zinc-700 rounded animate-pulse" />
        </div>
      </nav>
    );
  }
  return (
    <header className="bg-white flex justify-between items-center p-4 h-16 w-full">
      {/* Left: Logo */}
      <div className="text-xl font-bold text-[#f95959]">
        MyLogo
      </div>

      {/* Right: Auth Buttons */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-[#f95959] border border-[#f95959] bg-white hover:bg-[#f95959] hover:text-white hover:border-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Login
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-[#f95959] text-white hover:bg-white hover:text-[#f95959] border hover:border-[#f95959] rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign Up
            </button>
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
