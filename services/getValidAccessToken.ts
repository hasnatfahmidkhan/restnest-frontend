"use server";
import { cookies } from "next/headers";

export async function getValidAccessToken(): Promise<string> {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("accessToken")?.value;

  if (accessToken) {
    return accessToken;
  }

  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
    cache: "no-store",
  });

  const result = await res.json();

  if (!result.success || !result.data?.accessToken) {
    throw new Error("Unauthorized");
  }

  accessToken = result.data.accessToken as string;

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return accessToken;
}
