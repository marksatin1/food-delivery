import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Restaurant } from "@food-delivery/shared";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        {/* Restaurant image */}
        <div className="h-48 w-full bg-zinc-200">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
        </div>

        <CardContent className="p-4">
          {/* Name and rating */}
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg">{restaurant.name}</h3>
            <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded">
              ★ {restaurant.rating}
            </span>
          </div>

          {/* Cuisine tags */}
          <div className="mt-2 flex flex-wrap gap-1">
            {restaurant.cuisine.map((c) => (
              <Badge key={c} variant="secondary" className="text-xs">
                {c}
              </Badge>
            ))}
          </div>

          {/* Delivery info */}
          <div className="mt-3 flex items-center gap-3 text-sm text-zinc-500">
            <span>{restaurant.deliveryTime}</span>
            <span>•</span>
            <span>
              {restaurant.deliveryFee === 0
                ? "Free delivery"
                : `$${restaurant.deliveryFee.toFixed(2)} delivery`}
            </span>
          </div>

          {/* Open/Closed status */}
          {!restaurant.isOpen && (
            <p className="mt-2 text-sm font-medium text-red-500">
              Currently closed
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}