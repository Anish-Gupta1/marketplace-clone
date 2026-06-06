import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ListingCard from "@/app/components/ListingCard";
import DeleteListingButton from "@/app/components/DeleteListingButton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const listings = await prisma.listing.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Listings</h1>
              <p className="mt-2 text-gray-600">
                Manage all your listings in one place
              </p>
            </div>

            <Link
              href="/add-listing"
              className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
            >
              + Create Listing
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {listings.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <span className="text-3xl">📝</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                No listings yet.
              </h2>
              <p className="mt-2 text-gray-600">
                Start selling today by creating your first listing
              </p>
              <Link
                href="/add-listing"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  All Listings ({listings.length})
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    {/* Listing Card */}
                    <div className="flex-1">
                      <ListingCard
                        id={listing.id}
                        title={listing.title}
                        price={listing.price}
                        city={listing.city}
                        imageUrl={listing.imageUrl}
                        category={listing.category.name}
                      />
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-200 p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/listing/${listing.id}`}
                          className="flex-1 rounded-lg border border-blue-600 px-4 py-2 text-center text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                        >
                          View
                        </Link>
                        <DeleteListingButton listingId={listing.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
