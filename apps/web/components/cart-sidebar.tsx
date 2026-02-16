'use client';

import { useCart } from "./cart-context";
import { Button } from "./ui/button";

export function CartSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-center text-zinc-500">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {items.map((orderItem) => (
                <div
                  key={orderItem.menuItem.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  {/* Item image */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-zinc-200">
                    <img
                      src={orderItem.menuItem.image}
                      alt={orderItem.menuItem.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Item details */}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold">{orderItem.menuItem.name}</h3>
                    <p className="text-sm text-zinc-500">
                      ${orderItem.menuItem.price.toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="mt-1 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() =>
                          updateQuantity(
                            orderItem.menuItem.id,
                            orderItem.quantity - 1
                          )
                        }
                      >
                        −
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">
                        {orderItem.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() =>
                          updateQuantity(
                            orderItem.menuItem.id,
                            orderItem.quantity + 1
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Item total + remove */}
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ${(orderItem.menuItem.price * orderItem.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="mt-1 text-red-500 hover:text-red-700"
                      onClick={() => removeItem(orderItem.menuItem.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with totals */}
        {items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Delivery fee and tax calculated at checkout
            </p>

            <Button className="mt-4 w-full">
              Checkout · ${subtotal.toFixed(2)}
            </Button>

            <Button
              variant="ghost"
              className="mt-2 w-full text-zinc-500"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}