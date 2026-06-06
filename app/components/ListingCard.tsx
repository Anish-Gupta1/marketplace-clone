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
      <div className="group flex flex-col h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-lg hover:border-blue-300">
        {/* Image container */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={imageSrc || "https://placehold.co/400x300?text=No+Image"}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-110"
          />
          {/* Badge */}
          <div className="absolute top-2 right-2 rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
            {category}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h2 className="line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-blue-600">
              {title}
            </h2>
          </div>

          <div className="mt-4 space-y-2">
            <div className="text-xl font-bold text-blue-600">
              ₹{price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">{city}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
