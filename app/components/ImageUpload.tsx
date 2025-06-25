"use client";

import { UploadButton } from "../lib/uploadthing";
import { useActionState, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { toast } from "sonner";
import { gallarySchema } from "../lib/zodSchemas";
import { gallaryAction } from "../actions";

interface ImageUploadProps {
  onImageUploaded?: () => void;
}

export const ImageUpload = ({ onImageUploaded }: ImageUploadProps) => {

  const handleUpload = async (res: { url: string }[]) => {
    if (!res?.[0]?.url) return;

    try {
      const formData = new FormData();
      formData.append("gallaryImage", res[0].url);

      // ✅ directly call the server action
      const result = await gallaryAction(null, formData);

      if ("success" in result && result.success) {
        toast.success("Image uploaded to gallery!");
        // Call the callback to refresh images
        onImageUploaded?.();
      } else {
        toast.error("Image upload failed.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="mt-6">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={handleUpload}
        onUploadError={(error) => {
          console.error("Upload error:", error);
          toast.error(error.message);
        }}
        className="ut-button:bg-blue-500 ut-button:hover:bg-blue-600"
      />
    </div>
  );
};