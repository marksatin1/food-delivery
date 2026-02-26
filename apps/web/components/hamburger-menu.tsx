'use client';

import { useSession } from "@/context/session-context";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HamburgerMenu() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout } = useSession();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(prev => !prev)}
        className={`p-2 rounded cursor-pointer transition-transform duration-200 ${menuOpen ? 'rotate-90' : ''}`}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {menuOpen && (
        <div ref={dropdownRef} className='absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50'>
          <Link
            href='/account'
            onClick={() => setMenuOpen(false)}
            className='block px-4 py-2'>
            My Account
          </Link>
          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
              router.push('/logout');
            }}
            className="block w-full text-left px-4 py-2 cursor-pointer">
            Logout
          </button>
        </div>
      )}
    </div>
  )
}