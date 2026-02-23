'use client';

import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useCart } from "./cart-context";
import { toast } from "sonner";
import type { MenuItem } from "@food-delivery/shared";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem, replaceCart } = useCart();

  function handleAddToCart() {
    const result = addItem(item);
    if (result === 'conflict') {
      toast(
        'You already have items from another restaurant in your cart. Start a new order?',
        {
          action : {
            label: 'Yes, start a new order!',
            onClick: () => {
              replaceCart(item);
              toast.success("New order started!")
            }
          }
        }
      );
    } else if (result === 'added') {
      toast.success(`${item.name} added to cart!`);
    }
  }

  return (
    <Card className={`overflow-hidden ${!item.isAvailable ? "opacity-50" : ""}`}>
      <div className="flex">
        {/* Item details */}
        <CardContent className="flex-1 p-4">
          <div className="flex items-start gap-2">
            <h3 className="font-semibold">{item.name}</h3>
            {item.isPopular && (
              <Badge variant="destructive" className="text-xs">
                Popular
              </Badge>
            )}
          </div>

          <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
            {item.description}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-semibold">${item.price.toFixed(2)}</span>
            <Button
              size="sm"
              className="cursor-pointer"
              disabled={!item.isAvailable}
              onClick={handleAddToCart}
            >
              {item.isAvailable ? "Add to Cart" : "Unavailable"}
            </Button>
          </div>
        </CardContent>

        {/* Item image */}
        <div className="h-32 w-32 shrink-0 bg-zinc-200">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </Card>
  );
}