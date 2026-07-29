/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getCloudinarySignature } from "@/services/uploadAction";
import { useState } from "react";

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // 1. Get secure signature from Server Action
      const sigRes = await getCloudinarySignature();
      if (!sigRes.success || !sigRes.data) {
        throw new Error(sigRes.message || "Failed to authorize upload.");
      }

      const { signature, timestamp, folder, apiKey, cloudName } = sigRes.data;

      // 2. Prepare form data for Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      // 3. Upload directly to Cloudinary
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData },
      );

      const data = await res.json();

      if (!data.secure_url) {
        throw new Error(data.error?.message || "Image upload failed.");
      }

      return data.secure_url;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
}
