import Link from "next/link";
import ListingCard from "@/app/components/ListingCard";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    city: string;
  }>;
};

export default async function CityPage({ params }: Props) {
  const { city } = await params;

  const listings = await prisma.listing.findMany({
    where: {
      city,
    },
    include: {
      category: true,
    },
  });

  return (
    <main className="max-w-7xl mx-auto p-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{city}</h1>
          <p className="text-sm text-gray-600">Listings available in {city}.</p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-black transition hover:text-gray-700"
        >
          Back to Home
        </Link>
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
            There are no listings currently available for {city}. Please check
            back later or browse other locations.
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
