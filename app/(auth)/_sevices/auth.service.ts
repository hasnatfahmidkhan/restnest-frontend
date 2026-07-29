"use client";
import { TLoginInput } from "../_schemas/auth.schema";
import { ILoginResponse } from "../_types/auth.types";

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
