"use server";

import { getValidAccessToken } from "@/services/getValidAccessToken";
import { cookies } from "next/headers";
import { TLoginInput, TRegisterInput } from "../_schemas/auth.schema";
import { ILoginResponse, ILoginResponseRaw, IUser } from "../_types/auth.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export async function loginService(
  payload: TLoginInput,
): Promise<ILoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data: ILoginResponseRaw = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to login. Please check your credentials.",
    );
  }

  // Set tokens as HTTP-only cookies on the server
  const cookieStore = await cookies();
  const { accessToken, refreshToken } = data.data;

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 1, // 1 day
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  // Return only user data to the client — DO NOT return tokens
  return {
    success: data.success,
    message: data.message,
    data: {
      userData: data.data.userData,
    },
  };
}

export async function registerService(
  payload: TRegisterInput,
): Promise<ILoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to register. Please try again.");
  }

  // Return safe response (register might not have tokens, depends on backend)
  return {
    success: data.success,
    message: data.message,
    data: {
      userData: data.data?.userData,
    },
  };
}

export async function getMeService(): Promise<IUser> {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await response.json();


  if (!response.ok || !data.success) {
    throw new Error(data.message || "Session expired");
  }

  return data.data as IUser;
}

export async function googleLoginService(idToken: string) {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Google login failed");
  }

  const cookieStore = await cookies();
  const { accessToken, refreshToken } = data.data;

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 1, // 1 day
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return data;
}
