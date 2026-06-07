import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? "";
  const category = url.searchParams.get("category") ?? "";
  const city = url.searchParams.get("city") ?? "";
  const minPrice = url.searchParams.get("minPrice")
    ? Number(url.searchParams.get("minPrice"))
    : undefined;
  const maxPrice = url.searchParams.get("maxPrice")
    ? Number(url.searchParams.get("maxPrice"))
    : undefined;
  const sort = url.searchParams.get("sort") ?? "newest";

  const priceFilter: { gte?: number; lte?: number } = {};
  if (minPrice !== undefined && !Number.isNaN(minPrice)) {
    priceFilter.gte = minPrice;
  }
  if (maxPrice !== undefined && !Number.isNaN(maxPrice)) {
    priceFilter.lte = maxPrice;
  }

  const where = {
    ...(search
      ? {
          title: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {}),
    ...(category
      ? {
          category: {
            is: {
              name: {
                equals: category,
                mode: "insensitive" as const,
              },
            },
          },
        }
      : {}),
    ...(city
      ? {
          city: {
            equals: city,
            mode: "insensitive" as const,
          },
        }
      : {}),
    ...(Object.keys(priceFilter).length
      ? {
          price: priceFilter,
        }
      : {}),
  };

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "price-low"
        ? { price: "asc" as const }
        : sort === "price-high"
          ? { price: "desc" as const }
          : { createdAt: "desc" as const };

  const listings = await prisma.listing.findMany({
    where,
    include: {
      category: true,
    },
    orderBy,
  });

  const formattedListings = listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    price: listing.price,
    city: listing.city,
    imageUrl: listing.imageUrl,
    category: listing.category.name,
  }));

  return NextResponse.json({ listings: formattedListings });
}
