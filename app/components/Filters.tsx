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
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <span className="text-gray-400">🔍</span>
        </div>
        <input
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, brand, model..."
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
        />
      </div>

      {/* Filters grid */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="">All categories</option>
            {categories.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="">All cities</option>
            {cityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Min price (₹)
          </label>
          <input
            name="minPrice"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Max price (₹)
          </label>
          <input
            name="maxPrice"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Any"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            name="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className="flex items-end">
          <Link href="/" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            Clear All
          </Link>
        </div>
      </div>
    </div>
  );
}
