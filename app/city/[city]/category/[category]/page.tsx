import Link from "next/link";
import ListingCard from "@/app/components/ListingCard";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    city: string;
    category: string;
  }>;
};

export default async function CityCategoryPage({ params }: Props) {
  const { city, category } = await params;
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  const listings = await prisma.listing.findMany({
    where: {
      city,
      category: {
        is: {
          name: {
            equals: categoryName,
            mode: "insensitive",
          },
        },
      },
    },
    include: {
      category: true,
    },
  });

  return (
    <main className="max-w-7xl mx-auto p-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {city} - {categoryName}
          </h1>
          <p className="text-sm text-gray-600">
            Local listings for this city and category.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={`/city/${city}`} className="transition hover:text-black">
            Back to {city}
          </Link>
          <Link href="/" className="transition hover:text-black">
            Browse all listings
          </Link>
        </div>
      </div>

      {listings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
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
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <h2 className="text-2xl font-semibold mb-2">No listings found.</h2>
          <p className="text-sm text-gray-600 mb-4">
            There are no listings in {city} for {categoryName} yet.
          </p>
          <Link
            href="/"
            className="rounded bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
          >
            Browse all listings
          </Link>
        </div>
      )}
    </main>
  );
}
