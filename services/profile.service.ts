"use server";
import { z } from "zod";
import { getValidAccessToken } from "./getValidAccessToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(100, "Name cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .min(11, "Phone number must be at least 11 characters.")
    .max(20, "Phone number cannot exceed 20 characters.")
    .optional()
    .or(z.literal("")),

  bio: z
    .string()
    .trim()
    .max(500, "Bio cannot exceed 500 characters.")
    .optional()
    .or(z.literal("")),

  profilePhoto: z
    .url("Invalid profile photo URL.")
    .optional()
    .or(z.literal("")),
});

type ProfileFormState = {
  error?: string;
  success?: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: "ACTIVE" | "BAN";
    role: "ADMIN" | "TENANT" | "LANDLORD";
    profile: {
      id: string;
      profilePhoto: string;
      bio: string;
      userId: string;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export async function updateProfile(
  formData: FormData,
): Promise<ProfileFormState> {
  try {
    const payloadString = formData.get("payload");

    if (typeof payloadString !== "string") {
      return {
        error: "Invalid form data.",
      };
    }

    let rawPayload: unknown;

    try {
      rawPayload = JSON.parse(payloadString);
    } catch {
      return {
        error: "Invalid payload.",
      };
    }

    const validated = profileSchema.safeParse(rawPayload);

    if (!validated.success) {
      return {
        error: validated.error.issues[0]?.message ?? "Invalid data.",
      };
    }

    // Don't send empty values to backend
    const payload = Object.fromEntries(
      Object.entries(validated.data).filter(
        ([, value]) => value !== "" && value !== undefined,
      ),
    );

    if (Object.keys(payload).length === 0) {
      return {
        error: "No changes to save.",
      };
    }

    const accessToken = await getValidAccessToken();

    if (!accessToken) {
      return {
        error: "Authentication required.",
      };
    }

    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let message = "Failed to update profile.";

      try {
        const errorData = await response.json();

        message = errorData?.message ?? errorData?.error ?? message;
      } catch {
        // Non-JSON response
      }

      return {
        error: message,
      };
    }

    const result = await response.json();

    return {
      success: true,
      message: "Profile updated successfully!",
      user: result.data,
    };
  } catch (error) {
    console.error("Update profile error:", error);

    return {
      error: "An unexpected error occurred.",
    };
  }
}
