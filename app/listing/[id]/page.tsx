import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: {
      id,
    },

    include: {
      user: true,
      category: true,
      subCategory: true,
    },
  });

  if (!listing) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
            ← Back to listings
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Image Section */}
          <div className="md:col-span-2">
            <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-100 md:h-[500px]">
              <Image
                src={
                  listing.imageUrl || "https://placehold.co/800x600?text=No+Image"
                }
                alt={listing.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Description */}
            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">Description</h3>
              <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                {listing.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-600">Category</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {listing.category.name}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-600">Sub Category</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {listing.subCategory.name}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-600">Location</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {listing.area}, {listing.city}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-600">State & Country</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {listing.state}, {listing.country}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-600">Price</p>
              <p className="mt-2 text-4xl font-bold text-blue-600">
                ₹{listing.price.toLocaleString()}
              </p>
            </div>

            {/* Seller Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 font-bold text-gray-900">Seller Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {listing.user.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="mt-1 font-mono text-sm text-blue-600">
                    {listing.user.email}
                  </p>
                </div>

                <a
                  href={`mailto:${listing.user.email}?subject=Interested in ${listing.title}`}
                  className="mt-4 block w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-center font-semibold text-white transition hover:shadow-lg"
                >
                  Contact Seller
                </a>
              </div>
            </div>

            {/* Share Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 font-bold text-gray-900">Share This Listing</h3>
              <div className="flex gap-3">
                <button className="flex-1 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                  Share
                </button>
                <button className="flex-1 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
