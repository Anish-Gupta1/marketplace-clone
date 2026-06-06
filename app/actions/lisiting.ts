"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createListing(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = (formData.get("title") as string).trim();
  const description = (formData.get("description") as string).trim();
  const price = Number(formData.get("price"));
  const country = (formData.get("country") as string).trim().toLowerCase();
  const state = (formData.get("state") as string).trim().toLowerCase();
  const city = (formData.get("city") as string).trim().toLowerCase();
  const area = (formData.get("area") as string).trim().toLowerCase();
  const imageUrl = (formData.get("imageUrl") as string) || null;

  await prisma.listing.create({
    data: {
      title,
      description,
      price,
      country,
      state,
      city,
      area,
      imageUrl,
      categoryId: formData.get("categoryId") as string,
      subCategoryId: formData.get("subCategoryId") as string,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteListing(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const listingId = formData.get("listingId") as string;

  if (!listingId) {
    throw new Error("Listing id is required");
  }

  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing || listing.userId !== session.user.id) {
    throw new Error("Not authorized to delete this listing");
  }

  await prisma.listing.delete({
    where: {
      id: listingId,
    },
  });

  revalidatePath("/dashboard");
}
