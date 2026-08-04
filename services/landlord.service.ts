"use server";

import { getValidAccessToken } from "./getValidAccessToken";

const API_BASE_URL = process.env.BACKEND_API_URL as string;

export async function getLandlordStatsService() {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/landlord/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch stats");
  }

  return data.data;
}
