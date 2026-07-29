"use server";

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your private credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export async function getCloudinarySignature() {
  try {
    // The folder where images will be stored in Cloudinary
    const folder = "restnest";

    // Generate a timestamp (Unix time in seconds)
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Create the signature using the Cloudinary SDK
    // This ensures the request is authentic and hasn't been tampered with
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET as string,
    );

    return {
      success: true,
      data: {
        signature,
        timestamp,
        folder,
        apiKey: process.env.CLOUDINARY_API_KEY as string,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,
      },
    };
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    return { success: false, message: "Failed to get upload signature." };
  }
}
