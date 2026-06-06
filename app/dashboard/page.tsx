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
    <main className="max-w-6xl mx-auto p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="text-sm text-gray-600">
            Manage and delete listings that belong to your account.
          </p>
        </div>

        <Link
          href="/add-listing"
          className="rounded bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
        >
          Add Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <h2 className="text-2xl font-semibold mb-2">No listings yet.</h2>
          <p className="text-sm text-gray-600 mb-6">
            Your dashboard is empty. Create a listing to get started.
          </p>
          <Link
            href="/add-listing"
            className="rounded bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
          >
            Add your first listing
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {listings.map((listing) => (
            <div key={listing.id} className="space-y-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
              <ListingCard
                id={listing.id}
                title={listing.title}
                price={listing.price}
                city={listing.city}
                imageUrl={listing.imageUrl}
                category={listing.category.name}
              />
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/listing/${listing.id}`}
                  className="rounded border border-black px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
                >
                  View Listing
                </Link>
                <DeleteListingButton listingId={listing.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
