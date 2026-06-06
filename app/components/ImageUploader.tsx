"use client";

import { CldUploadButton } from "next-cloudinary";

type Props = {
  onUpload: (url: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
};

export default function ImageUploader({
  onUpload,
  onError,
  disabled = false,
}: Props) {
  return (
    <div className="space-y-2">
      {!disabled ? (
        <CldUploadButton
          uploadPreset="olx-clone"
          onSuccess={(result) => {
            const uploadResult = result as {
              info: {
                secure_url: string;
              };
            };

            onUpload(uploadResult.info.secure_url);
          }}
          onError={() => {
            onError?.(
              "Image upload failed. Please try again."
            );
          }}
        >
          Upload Image
        </CldUploadButton>
      ) : (
        <button
          type="button"
          disabled
          className="rounded border border-gray-300 px-4 py-2 opacity-60 cursor-not-allowed"
        >
          Upload Disabled
        </button>
      )}
    </div>
  );
}