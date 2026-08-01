"use server";

import { getNewAccesssToken } from "@/services/getNewAccesssToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const propertySchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  rentPrice: z.coerce.number().min(1, "Price must be greater than 0"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  division: z.string().min(2, "Division is required"),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  area: z.coerce.number().min(1, "Area is required"),
  categoryId: z.string().uuid("Invalid category"),
  amenityIds: z.array(z.string().uuid()).optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        isPrimary: z.boolean(),
      }),
    )
    .min(1, "At least one image is required"),
});

export type PropertyFormState = {
  error?: string;
  success?: boolean;
  message?: string;
};

export async function saveProperty(
  propertyId: string | null,
  prevState: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const rawPayload = JSON.parse(formData.get("payload") as string);
  const validated = propertySchema.safeParse(rawPayload);

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || "Invalid form data" };
  }

  const payload = validated.data;
  const isEdit = !!propertyId;
  const endpoint = isEdit
    ? `${process.env.NEXT_PUBLIC_API_URL}/landlord/properties/${propertyId}`
    : `${process.env.NEXT_PUBLIC_API_URL}/landlord/properties`;

  // Auth & Token Logic
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  let tokenToUse: string | undefined = undefined;

  if (accessToken) {
    tokenToUse = accessToken;
  }

  if (!tokenToUse) {
    const refreshResult = await getNewAccesssToken();
    if (!refreshResult?.success || !refreshResult.data?.accessToken) {
      redirect(`/login?redirectTo=/dashboard/landlord/properties`);
    }
    tokenToUse = refreshResult.data.accessToken;
  }

  try {
    const res = await fetch(endpoint, {
      method: isEdit ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenToUse}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
      redirect(`/login?redirectTo=/dashboard/landlord/properties`);
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return {
        error:
          errorData?.message ||
          `Failed to ${isEdit ? "update" : "create"} property`,
      };
    }

    return {
      success: true,
      message: `Property ${isEdit ? "updated" : "created"} successfully!`,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: "An unexpected error occurred." };
  }
}
