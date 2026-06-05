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
  const categoryName =
  category.charAt(0).toUpperCase() +
  category.slice(1);

  const listings = await prisma.listing.findMany({
    where: {
      city,

      category: {
        name: categoryName,
      },
    },

    include: {
      category: true,
    },
  });

  return (
    <main className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        {city} - {category}
      </h1>

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
