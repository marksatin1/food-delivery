'use client';

import { useState } from "react";
import { useCart } from "./cart-context";
import { CartSidebar } from "./cart-sidebar";
import { Button } from "./ui/button";

export function CartButton() {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        variant='ghost'
        size='sm'
        className='relative'
        onClick={() => setIsOpen(true)}
      >
        🛒
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
            {totalItems}
          </span>
        )}
      </Button>

      <CartSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}