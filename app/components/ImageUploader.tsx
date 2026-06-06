"use client";

import { CldUploadButton } from "next-cloudinary";

export default function ImageUploader({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  return (
    <CldUploadButton
      uploadPreset="olx-clone"
      onSuccess={(result: unknown) => {
        const uploadResult = result as {
          info: {
            secure_url: string;
          };
        };
        onUpload(uploadResult.info.secure_url);
      }}
    >
      Upload Image
    </CldUploadButton>
  );
}

