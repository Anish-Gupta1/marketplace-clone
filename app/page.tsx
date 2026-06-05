import { prisma } from "@/lib/prisma";
import ListingCard from "@/app/components/ListingCard";

export default async function HomePage() {
  const listings = await prisma.listing.findMany({
    include: {
      category: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Marketplace</h1>

      <div className="grid md:grid-cols-3 gap-6">
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
    </main>
  );
}
