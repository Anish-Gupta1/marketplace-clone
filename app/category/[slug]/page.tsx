import Link from "next/link";
import ListingCard from "@/app/components/ListingCard";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  const listings = await prisma.listing.findMany({
    where: {
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
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="text-blue-100 transition hover:text-white">
            ← Back to home
          </Link>
          <h1 className="mt-4 text-4xl font-bold">{categoryName}</h1>
          <p className="mt-2 text-blue-100">
            Browse all listings in this category
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {listings.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {listings.length} {listings.length === 1 ? "listing" : "listings"} found
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <span className="text-2xl">📦</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                No listings found.
              </h2>
              <p className="mt-2 text-gray-600">
                There are no active listings in the {categoryName} category right now.
              </p>
              <Link
                href="/"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Browse all listings
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
