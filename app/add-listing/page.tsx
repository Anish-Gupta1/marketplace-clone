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
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Post Your Item
          </h1>
          <p className="mt-2 text-gray-600">
            Fill in the details and sell your item quickly
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-8">
          <AddListingForm
            categories={categories}
          />
        </div>

        {/* Tips */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="font-semibold text-blue-900">💡 Tips for a great listing</h3>
          <ul className="mt-3 space-y-2 text-sm text-blue-800">
            <li>• Use clear, descriptive titles (e.g., "iPhone 15 Pro 256GB" instead of "Phone")</li>
            <li>• Include all important details in the description</li>
            <li>• Upload clear, well-lit photos</li>
            <li>• Set a competitive price based on market rates</li>
            <li>• Provide accurate location information</li>
          </ul>
        </div>
      </div>
    </main>
  );
}