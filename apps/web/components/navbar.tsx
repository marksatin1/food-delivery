'use client';

import Link from "next/link";
import { CartButton } from "./cart-button";
import { useSession } from "@/context/session-context";
import HamburgerMenu from "./hamburger-menu";

export default function Navbar() {
  const { user, logout } = useSession();

  return (
    <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
      <Link href="/" className="text-2xl font-bold text-red-600">
        FoodFrenzy
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/" className="text-lg font-medium hover:text-red-600">
          Restaurants
        </Link>
        {user && (
          <>
            <CartButton />
            <HamburgerMenu />
          </>
        )}
        {!user && (
          <Link href='/login' className="bg-green-500 text-white px-3 py-1 rounded">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
};