// actions/rentals.ts
"use server";

import { jwtUtils } from "@/lib/jwt";
import { getNewAccesssToken } from "@/services/getNewAccesssToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const rentalSchema = z.object({
  propertyId: z.uuid(),
  moveInDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  leaseMonths: z.coerce.number().int().min(1),
  message: z.string().optional(),
});

export type RentalState = {
  error?: string;
  success?: boolean;
  message?: string;
};

export async function createRentalRequest(
  prevState: RentalState,
  formData: FormData,
): Promise<RentalState> {
  // 1. Validate Form Data
  const validatedFields = rentalSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      error: "Invalid form data. Please check your inputs.",
    };
  }

  const { propertyId, moveInDate, leaseMonths, message } = validatedFields.data;

  const payload = {
    propertyId,
    moveInDate: new Date(moveInDate).toISOString(),
    leaseMonths,
    message: message || "Interested in renting this property.",
  };

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  let tokenToUse: string | undefined = undefined;

  // 2. Check if accessToken exists and verify it
  if (accessToken) {
    const verificationResult = jwtUtils.verifyJWTToken(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string,
    );

    if (verificationResult.success) {
      tokenToUse = accessToken;
    }
  }

  // 3. If no valid access token, try to get a new one
  if (!tokenToUse) {
    const refreshResult = await getNewAccesssToken();

    if (!refreshResult?.success || !refreshResult.data?.accessToken) {
      // Both access and refresh tokens are invalid/missing -> Redirect to login
      redirect(`/login?redirectTo=/properties/${propertyId}`);
    }

    tokenToUse = refreshResult.data.accessToken;
  }

  // 4. Send the API request with the valid token
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rentals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenToUse}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    // If backend still rejects the token (edge case)
    if (res.status === 401 || res.status === 403) {
      redirect(`/login?redirectTo=/properties/${propertyId}`);
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return {
        error:
          errorData?.message ||
          "Failed to submit rent request. Please try again.",
      };
    }

    const data = await res.json();
    return {
      success: true,
      message: data.message || "Rental request created successfully!",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      error: "An unexpected error occurred while contacting the server.",
    };
  }
}
