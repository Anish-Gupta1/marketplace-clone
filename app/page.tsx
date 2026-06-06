import type { Prisma } from "@prisma/client";
import Link from "next/link";
import ListingCard from "@/app/components/ListingCard";
import Filters from "@/app/components/Filters";
import { prisma } from "@/lib/prisma";

type HomePageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const search =
    typeof params.search === "string" ? params.search : "";
  const category =
    typeof params.category === "string" ? params.category : "";
  const city = typeof params.city === "string" ? params.city : "";
  const minPrice =
    typeof params.minPrice === "string"
      ? Number(params.minPrice)
      : undefined;
  const maxPrice =
    typeof params.maxPrice === "string"
      ? Number(params.maxPrice)
      : undefined;
  const sort =
    typeof params.sort === "string" ? params.sort : "newest";

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const citiesData = await prisma.listing.findMany({
    distinct: ["city"],
    select: {
      city: true,
    },
    orderBy: {
      city: "asc",
    },
  });

  const cityOptions = citiesData.map((item) => item.city).filter(Boolean);

  const priceFilter: { gte?: number; lte?: number } = {};
  if (minPrice !== undefined && !Number.isNaN(minPrice)) {
    priceFilter.gte = minPrice;
  }
  if (maxPrice !== undefined && !Number.isNaN(maxPrice)) {
    priceFilter.lte = maxPrice;
  }

  const where: any = {
    ...(search
      ? {
          title: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {}),
    ...(category
      ? {
          category: {
            is: {
              name: {
                equals: category,
                mode: "insensitive",
              },
            },
          },
        }
      : {}),
    ...(city
      ? {
          city: {
            equals: city,
            mode: "insensitive",
          },
        }
      : {}),
    ...(Object.keys(priceFilter).length
      ? {
          price: priceFilter,
        }
      : {}),
  };

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "price-low"
      ? { price: "asc" as const }
      : sort === "price-high"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  const listings = await prisma.listing.findMany({
    where: where as Prisma.ListingWhereInput,
    include: {
      category: true,
    },
    orderBy,
  });

  return (
    <main className="max-w-7xl mx-auto p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Marketplace</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Browse listings with search, category, city, price filters, and sorting.
          </p>
        </div>

        <Link
          href="/add-listing"
          className="rounded bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
        >
          Add Listing
        </Link>
      </div>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm mb-10">
        <h2 className="text-xl font-semibold mb-4">Search and filters</h2>

        <Filters
          initialSearch={search}
          initialCategory={category}
          initialCity={city}
          initialMinPrice={minPrice}
          initialMaxPrice={maxPrice}
          initialSort={sort}
          categories={categories}
          cityOptions={cityOptions}
        />
      </section>

      {listings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              price={listing.price}
              city={listing.city}
              imageUrl={listing.imageUrl}
              category={listing.category.name}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center text-gray-600">
          <h2 className="text-2xl font-semibold mb-2">No listings found.</h2>
          <p className="max-w-xl mx-auto text-sm">
            Try adjusting your search terms or clearing filters to view more listings.
          </p>
        </div>
      )}
    </main>
  );
}
