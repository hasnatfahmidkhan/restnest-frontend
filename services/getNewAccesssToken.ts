"use server";

import { cookies } from "next/headers";

export const getNewAccesssToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) {
    return {
      success: false,
      message: "Refresh token not found",
      data: null,
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-cache",
    },
  );

  const result = await res.json();
  return result;
};
