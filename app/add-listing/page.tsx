import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import AddListingForm from "@/app/components/AddListingForm"

export default async function AddListingPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const categories =
    await prisma.category.findMany({
      include: {
        subCategories: true,
      },
    });

  return (
    <div className="max-w-2xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">
        Add Listing
      </h1>

      <AddListingForm
        categories={categories}
      />
    </div>
  );
}