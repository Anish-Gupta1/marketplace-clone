"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createListing(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.listing.create({
    data: {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      country: (formData.get("country") as string).trim().toLowerCase(),
      state: (formData.get("state") as string).trim().toLowerCase(),
      city: (formData.get("city") as string).trim().toLowerCase(),
      area: (formData.get("area") as string).trim().toLowerCase(),
      imageUrl: (formData.get("imageUrl") as string) || null,
      categoryId: formData.get("categoryId") as string,
      subCategoryId: formData.get("subCategoryId") as string,

      userId: session.user.id,
    },
  });

  redirect("/dashboard");
}
