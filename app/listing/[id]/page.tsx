import Image from "next/image";
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
    <main className="max-w-6xl mx-auto p-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative h-500">
          <Image
            src={
              listing.imageUrl || "https://placehold.co/800x600?text=No+Image"
            }
            alt={listing.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>

          <h2 className="text-3xl font-semibold mb-6">
            ₹{listing.price.toLocaleString()}
          </h2>

          <div className="space-y-3">
            <p>
              <strong>Category:</strong> {listing.category.name}
            </p>

            <p>
              <strong>SubCategory:</strong> {listing.subCategory.name}
            </p>

            <p>
              <strong>Location:</strong> {listing.area}, {listing.city},{" "}
              {listing.state}, {listing.country}
            </p>

            <p>
              <strong>Posted By:</strong> {listing.user.name}
            </p>

            <p>
              <strong>Email:</strong> {listing.user.email}
            </p>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-xl mb-3">Description</h3>

            <p>{listing.description}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
