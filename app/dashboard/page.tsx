import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
      subCategory: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>

        <Link
          href="/add-listing"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Listing
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="border rounded-lg p-4">
            <Link href={`/listing/${listing.id}`} className="font-bold text-lg">
              {listing.title}
            </Link>

            <p>₹{listing.price.toLocaleString()}</p>

            <p>{listing.category.name}</p>

            <p>{listing.subCategory.name}</p>

            <p>{listing.city}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
