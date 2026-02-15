import { fetchApi } from "@/lib/api";
import { RestaurantCard } from "@/components/restaurant-card";
import { Input } from "@/components/ui/input";
import type { Restaurant } from "@food-delivery/shared";

export default async function HomePage() {
  const restaurants = await fetchApi<Restaurant[]>("/api/restaurants");

  return (
    <div>
      {/* Hero section */}
      <section className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Hungry? We&apos;ve got you covered.
        </h1>
        <p className="mt-2 text-lg text-zinc-500">
          Order from the best local restaurants with fast delivery.
        </p>
      </section>

      {/* Search bar */}
      <div className="mb-8">
        <Input
          type="search"
          placeholder="Search restaurants or cuisines..."
          className="max-w-md"
        />
      </div>

      {/* Restaurant grid */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Restaurants near you</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>
    </div>
  );
}