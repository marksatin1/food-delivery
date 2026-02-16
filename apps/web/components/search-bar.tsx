'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        router.push(`/?q=${encodeURIComponent(query.trim())}`);
      } else if (searchParams.get('q')) {
        router.push('/');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  return (
    <div className="mb-8">
      <Input
        type="search"
        placeholder="Search restaurants or cuisines..."
        className="max-w-md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}