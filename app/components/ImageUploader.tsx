"use client";

import { CldUploadButton } from "next-cloudinary";

export default function ImageUploader({
  onUpload,
  onError,
  disabled = false,
}: {
  onUpload: (url: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <CldUploadButton
        uploadPreset="olx-clone"
        disabled={disabled}
        onSuccess={(result: unknown) => {
          const uploadResult = result as {
            info: {
              secure_url: string;
            };
          };

          onUpload(uploadResult.info.secure_url);
        }}
        onError={() => {
          onError?.("Image upload failed. Please try again.");
        }}
        className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Upload Image
      </CldUploadButton>
    </div>
  );
}

