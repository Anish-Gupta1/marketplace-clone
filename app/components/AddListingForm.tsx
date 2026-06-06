"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "./Toast";
import ImageUploader from "./ImageUploader";

type Category = {
  id: string;
  name: string;
  subCategories: {
    id: string;
    name: string;
  }[];
};

export default function AddListingForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const subCategories = useMemo(() => {
    const category = categories.find((c) => c.id === selectedCategory);

    return category?.subCategories ?? [];
  }, [selectedCategory, categories]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const title = (formData.get("title") as string)?.trim();
      const description = (formData.get("description") as string)?.trim();
      const price = Number(formData.get("price"));
      const country = (formData.get("country") as string)?.trim();
      const state = (formData.get("state") as string)?.trim();
      const city = (formData.get("city") as string)?.trim();
      const area = (formData.get("area") as string)?.trim();
      const categoryId = formData.get("categoryId") as string;
      const subCategoryId = formData.get("subCategoryId") as string;

      // Validation
      if (!title || title.length < 3) {
        setError("Title must be at least 3 characters");
        return;
      }

      if (!description || description.length < 10) {
        setError("Description must be at least 10 characters");
        return;
      }

      if (!price || price <= 0) {
        setError("Price must be greater than 0");
        return;
      }

      if (!country || !state || !city || !area) {
        setError("All location fields are required");
        return;
      }

      if (!categoryId || !subCategoryId) {
        setError("Please select a category and subcategory");
        return;
      }

      const res = await fetch("/api/listings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price,
          country,
          state,
          city,
          area,
          imageUrl: imageUrl || null,
          categoryId,
          subCategoryId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to create listing");
        return;
      }

      setSuccess("Listing created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title and Description Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Item Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              name="title"
              placeholder="e.g., iPhone 15 Pro Max 256GB"
              required
              minLength={3}
              className="w-full border border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">Be specific and descriptive</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Describe your item's condition, features, and reason for selling..."
              required
              minLength={10}
              className="w-full min-h-[120px] resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Price Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              name="price"
              type="number"
              placeholder="0"
              required
              min="1"
              step="0.01"
              className="w-full border border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Location</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                name="country"
                placeholder="India"
                required
                className="w-full border border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                name="state"
                placeholder="Maharashtra"
                required
                className="w-full border border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                name="city"
                placeholder="Mumbai"
                required
                className="w-full border border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area *
              </label>
              <input
                name="area"
                placeholder="Bandra"
                required
                className="w-full border border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Category Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Category</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                required
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                disabled={isLoading}
              >
                <option value="">Select a category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Category *
              </label>
              <select
                name="subCategoryId"
                required
                disabled={!selectedCategory || isLoading}
                className="w-full border border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">
                  {selectedCategory ? "Select sub category" : "Select category first"}
                </option>

                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="space-y-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Upload Image</h2>
          
          <ImageUploader
            onUpload={(url) => {
              setImageUrl(url);
              setUploadError("");
            }}
            onError={(message) => setUploadError(message)}
            disabled={isLoading}
          />

          {uploadError ? (
            <p className="text-sm text-red-600">❌ {uploadError}</p>
          ) : imageUrl ? (
            <p className="text-sm text-green-600">✓ Image uploaded successfully</p>
          ) : (
            <p className="text-sm text-gray-500">Upload a clear photo of your item (optional)</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-lg font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating Listing..." : "Create Listing"}
        </button>
      </form>

      {error && (
        <Toast
          type="error"
          message={error}
          duration={5000}
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <Toast
          type="success"
          message={success}
          duration={3000}
          onClose={() => setSuccess(null)}
        />
      )}
    </>
  );
}
