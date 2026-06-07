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
  const search = typeof params.search === "string" ? params.search : "";
  const category = typeof params.category === "string" ? params.category : "";
  const city = typeof params.city === "string" ? params.city : "";
  const minPrice =
    typeof params.minPrice === "string" ? Number(params.minPrice) : undefined;
  const maxPrice =
    typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "newest";

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

  const where: unknown = {
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
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold md:text-5xl">
            Find what you want locally
          </h1>
          <p className="mt-2 text-lg text-blue-100">
            Browse thousands of listings or sell your own items in seconds
          </p>
          <Link
            href="/add-listing"
            className="mt-6 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-gray-100"
          >
            Start Selling
          </Link>
        </div>
      </section>

      {/* Category Grid */}
      {!search && !category && !city && (
        <section
          id="categories"
          className="border-b border-gray-200 bg-white px-4 py-12"
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">
              Browse Categories
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.name}`}
                  className="rounded-lg border border-gray-200 bg-white p-4 text-center transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="text-2xl">📦</div>
                  <h3 className="mt-2 font-semibold text-gray-900">
                    {cat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters Section */}
      <section className="border-b border-gray-200 bg-white px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            {search || category || city
              ? "Refine Your Search"
              : "Search & Filter"}
          </h2>

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
        </div>
      </section>

      {/* Listings Section */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {listings.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {search
                    ? `Search results for "${search}"`
                    : category
                      ? `${category} listings`
                      : city
                        ? `Listings in ${city}`
                        : "Latest Listings"}
                </h2>
                <p className="text-sm text-gray-600">
                  {listings.length} results
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {listings.map(
                  (listing: {
                    id: string;
                    title: string;
                    price: number;
                    city: string;
                    imageUrl: string | null;
                    category: {
                      name: string;
                    };
                  }) => (
                    <ListingCard
                      key={listing.id}
                      id={listing.id}
                      title={listing.title}
                      price={listing.price}
                      city={listing.city}
                      imageUrl={listing.imageUrl}
                      category={listing.category.name}
                    />
                  ),
                )}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <span className="text-2xl">🔍</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                No listings found.
              </h2>
              <p className="mt-2 text-gray-600">
                Try adjusting your search terms or browse all listings
              </p>
              <Link
                href="/"
                className="mt-6 inline-block rounded bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                Browse All Listings
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
