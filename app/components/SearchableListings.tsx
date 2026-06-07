"use client";

import { useEffect, useRef, useState } from "react";
import Filters from "@/app/components/Filters";
import ListingCard from "@/app/components/ListingCard";

type CategoryOption = { id: string; name: string };

type ListingItem = {
  id: string;
  title: string;
  price: number;
  city: string;
  imageUrl: string | null;
  category: string;
};

type SearchableListingsProps = {
  initialSearch: string;
  initialCategory: string;
  initialCity: string;
  initialMinPrice?: number;
  initialMaxPrice?: number;
  initialSort: string;
  categories: CategoryOption[];
  cityOptions: string[];
  initialListings: ListingItem[];
};

export default function SearchableListings({
  initialSearch,
  initialCategory,
  initialCity,
  initialMinPrice,
  initialMaxPrice,
  initialSort,
  categories,
  cityOptions,
  initialListings,
}: SearchableListingsProps) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [city, setCity] = useState(initialCity);
  const [minPrice, setMinPrice] = useState<string>(
    initialMinPrice !== undefined ? String(initialMinPrice) : "",
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    initialMaxPrice !== undefined ? String(initialMaxPrice) : "",
  );
  const [sort, setSort] = useState(initialSort);
  const [listings, setListings] = useState<ListingItem[]>(initialListings);
  const [isLoading, setIsLoading] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    setSearch(initialSearch);
    setCategory(initialCategory);
    setCity(initialCity);
    setMinPrice(initialMinPrice !== undefined ? String(initialMinPrice) : "");
    setMaxPrice(initialMaxPrice !== undefined ? String(initialMaxPrice) : "");
    setSort(initialSort);
    setListings(initialListings);
  }, [initialSearch, initialCategory, initialCity, initialMinPrice, initialMaxPrice, initialSort, initialListings]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);

    setIsLoading(true);

    fetch(`/api/listings/search?${params.toString()}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        setListings(data.listings ?? []);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Unable to load listings:", error);
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [search, category, city, minPrice, maxPrice, sort]);

  return (
    <div className="space-y-8">
      <Filters
        initialSearch={search}
        initialCategory={category}
        initialCity={city}
        initialMinPrice={minPrice === "" ? undefined : Number(minPrice)}
        initialMaxPrice={maxPrice === "" ? undefined : Number(maxPrice)}
        initialSort={sort}
        categories={categories}
        cityOptions={cityOptions}
        onFiltersChange={({
          search: nextSearch,
          category: nextCategory,
          city: nextCity,
          minPrice: nextMinPrice,
          maxPrice: nextMaxPrice,
          sort: nextSort,
        }) => {
          setSearch(nextSearch);
          setCategory(nextCategory);
          setCity(nextCity);
          setMinPrice(nextMinPrice === undefined ? "" : nextMinPrice);
          setMaxPrice(nextMaxPrice === undefined ? "" : nextMaxPrice);
          setSort(nextSort);
        }}
      />

      <section className="px-0">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <span className="text-2xl">⏳</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                Loading listings...
              </h2>
            </div>
          ) : listings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  city={listing.city}
                  imageUrl={listing.imageUrl}
                  category={listing.category}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <span className="text-2xl">🔍</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                No listings found.
              </h2>
              <p className="mt-2 text-gray-600">
                Try adjusting your search terms or browse all listings.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
