import Link from "next/link";
import Image from "next/image";

type ListingCardProps = {
  id: string;
  title: string;
  price: number;
  city: string;
  imageUrl: string | null;
  category: string;
};

export default function ListingCard({
  id,
  title,
  price,
  city,
  imageUrl,
  category,
}: ListingCardProps) {
  const imageSrc =
    imageUrl &&
    (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))
      ? imageUrl
      : "/no-image.png";

  return (
    <Link href={`/listing/${id}`}>
      <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-56 w-full">
          <Image
            src={imageSrc || "https://placehold.co/600x400?text=No+Image"}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="space-y-2 p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-xl font-bold">₹{price.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{category}</p>
          <p className="text-sm text-gray-400">{city}</p>
        </div>
      </div>
    </Link>
  );
}
