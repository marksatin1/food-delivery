import { Suspense } from "react";
import { fetchApi } from "@/lib/api";
import { RestaurantCard } from "@/components/restaurant-card";
import { SearchBar } from "@/components/search-bar";
import type { Restaurant } from "@food-delivery/shared";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const restaurants = await fetchApi<Restaurant[]>("/api/restaurants", q ? { params: { q } } : undefined);

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
      {/* Suspense allows page to statically render while search params load in */}
      <Suspense>
        <SearchBar />
      </Suspense>

      {/* Restaurant grid */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          {q ? `Results for "${q}"` : "Restaurants near you"}
        </h2>
        {restaurants.length === 0 ? (
          <p className="text-zinc-500">
            No restaurants found. Try a different search term.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}