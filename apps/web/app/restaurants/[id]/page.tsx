import { fetchApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MenuItemCard } from "@/components/menu-item-card";
import type { Restaurant, MenuItem } from "@food-delivery/shared";

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [restaurant, menuItems] = await Promise.all([
    fetchApi<Restaurant>(`/api/restaurants/${id}`),
    fetchApi<MenuItem[]>(`/api/restaurants/${id}/menu`),
  ]);

  // Group menu items by category
  const categories = [...new Set(menuItems.map((item) => item.category))];

  return (
    <div>
      {/* Restaurant header */}
      <section className="mb-8">
        <div className="h-64 w-full overflow-hidden rounded-lg bg-zinc-200">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <span className="rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-800">
              ★ {restaurant.rating} ({restaurant.reviewCount} reviews)
            </span>
          </div>

          <p className="mt-2 text-zinc-500">{restaurant.description}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {restaurant.cuisine.map((c) => (
              <Badge key={c} variant="secondary">
                {c}
              </Badge>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
            <span>{restaurant.deliveryTime}</span>
            <span>•</span>
            <span>
              {restaurant.deliveryFee === 0
                ? "Free delivery"
                : `$${restaurant.deliveryFee.toFixed(2)} delivery`}
            </span>
            <span>•</span>
            <span>${restaurant.minimumOrder} minimum</span>
          </div>

          {!restaurant.isOpen && (
            <p className="mt-3 font-medium text-red-500">Currently closed</p>
          )}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Menu sections */}
      {categories.map((category) => (
        <section key={category} className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">{category}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {menuItems
              .filter((item) => item.category === category)
              .map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}