"use client";

import { useMemo, useState } from "react";
import { createListing } from "@/app/actions/lisiting";
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const subCategories = useMemo(() => {
    const category = categories.find((c) => c.id === selectedCategory);

    return category?.subCategories ?? [];
  }, [selectedCategory, categories]);

  return (
    <form action={createListing} className="flex flex-col gap-4">
      <input
        name="title"
        placeholder="Title"
        required
        className="border p-2 rounded"
      />

      <textarea
        name="description"
        placeholder="Description"
        required
        className="border p-2 rounded"
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        required
        className="border p-2 rounded"
      />

      <input
        name="country"
        placeholder="Country"
        required
        className="border p-2 rounded"
      />

      <input
        name="state"
        placeholder="State"
        required
        className="border p-2 rounded"
      />

      <input
        name="city"
        placeholder="City"
        required
        className="border p-2 rounded"
      />

      <input
        name="area"
        placeholder="Area"
        required
        className="border p-2 rounded"
      />

      <ImageUploader onUpload={setImageUrl} />
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <select
        name="categoryId"
        required
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select Category</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        name="subCategoryId"
        required
        disabled={!selectedCategory}
        className="border p-2 rounded"
      >
        <option value="">Select SubCategory</option>

        {subCategories.map((subCategory) => (
          <option key={subCategory.id} value={subCategory.id}>
            {subCategory.name}
          </option>
        ))}
      </select>

      <button type="submit" className="bg-black text-white p-3 rounded">
        Create Listing
      </button>
    </form>
  );
}
