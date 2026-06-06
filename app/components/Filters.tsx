"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type CategoryOption = { id: string; name: string };

type FiltersProps = {
  initialSearch?: string;
  initialCategory?: string;
  initialCity?: string;
  initialMinPrice?: number | undefined;
  initialMaxPrice?: number | undefined;
  initialSort?: string;
  categories: CategoryOption[];
  cityOptions: string[];
};

export default function Filters({
  initialSearch = "",
  initialCategory = "",
  initialCity = "",
  initialMinPrice,
  initialMaxPrice,
  initialSort = "newest",
  categories,
  cityOptions,
}: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [city, setCity] = useState(initialCity);
  const [minPrice, setMinPrice] = useState(initialMinPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice ?? "");
  const [sort, setSort] = useState(initialSort);

  const debounceRef = useRef<number | null>(null);

  function applyParams(params: Record<string, string | undefined>) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") searchParams.set(k, v);
    });

    const q = searchParams.toString();
    const url = q ? `${pathname}?${q}` : pathname;
    router.replace(url);
  }

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      applyParams({
        search,
        category,
        city,
        minPrice: minPrice === "" ? undefined : String(minPrice),
        maxPrice: maxPrice === "" ? undefined : String(maxPrice),
        sort,
      });
    }, 400);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Immediate apply for other controls
  useEffect(() => {
    applyParams({
      search,
      category,
      city,
      minPrice: minPrice === "" ? undefined : String(minPrice),
      maxPrice: maxPrice === "" ? undefined : String(maxPrice),
      sort,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, city, minPrice, maxPrice, sort]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6 xl:items-end">
      <label className="space-y-2">
        <span className="text-sm font-medium text-gray-700">Search</span>
        <input
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title"
          className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-gray-700">Category</span>
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          <option value="">All categories</option>
          {categories.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-gray-700">City</span>
        <select
          name="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          <option value="">All cities</option>
          {cityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-gray-700">Min price</span>
        <input
          name="minPrice"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="0"
          className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-gray-700">Max price</span>
        <input
          name="maxPrice"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Any"
          className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-gray-700">Sort by</span>
        <select
          name="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price Low To High</option>
          <option value="price-high">Price High To Low</option>
        </select>
      </label>

      <div className="flex items-center gap-3">
        <Link href="/" className="text-sm font-medium text-gray-600 transition hover:text-black">
          Reset Filters
        </Link>
      </div>
    </div>
  );
}
