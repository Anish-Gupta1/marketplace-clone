"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

type DeleteListingButtonProps = {
  listingId: string;
};

export default function DeleteListingButton({ listingId }: DeleteListingButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function handleConfirm() {
    try {
      setIsDeleting(true);

      const res = await fetch("/api/listings/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to delete listing");
      }

      setIsOpen(false);
      router.refresh();
    } catch (e) {
      // swallow - UI could show an error toast here
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isDeleting}
        className="inline rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title="Delete listing"
        description="This action cannot be undone. Are you sure you want to delete this listing?"
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
