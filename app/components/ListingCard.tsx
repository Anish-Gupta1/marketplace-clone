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
  // console.log("IMAGE URL:", imageUrl);
  const imageSrc =
    imageUrl &&
    (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))
      ? imageUrl
      : "/no-image.png";

  return (
    <Link href={`/listing/${id}`}>
      <div className="border relative w-full h-48 rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
        <Image
          src={imageSrc || "https://placehold.co/600x400?text=No+Image"}
          alt={title}
          fill
          className="object-cover"
        />
        <p>{imageUrl}</p>
        <div className="p-4">
          <h2 className="font-bold text-lg">₹{price.toLocaleString()}</h2>

          <p className="font-medium">{title}</p>

          <p className="text-gray-500">{category}</p>

          <p className="text-sm text-gray-400">{city}</p>
        </div>
      </div>
    </Link>
  );
}
