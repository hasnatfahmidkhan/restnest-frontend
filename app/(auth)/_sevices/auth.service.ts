"use client";
import { TLoginInput } from "../_schemas/auth.schema";
import { ILoginResponse, IUser } from "../_types/auth.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function loginService(
  payload: TLoginInput,
): Promise<ILoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to login. Please check your credentials.",
    );
  }

  return data as ILoginResponse;
}

export async function getMeService(): Promise<IUser> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Crucial: sends the HTTP-only cookie automatically
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Session expired");
  }

  return data.data as IUser;
}
