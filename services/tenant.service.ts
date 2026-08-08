"use server";

import { TenantRentalsQuery } from "@/hooks/useTenantRentals";
import { getValidAccessToken } from "./getValidAccessToken";

const API_BASE_URL = process.env.BACKEND_API_URL as string;

export async function getTenantRentalsService(query: TenantRentalsQuery) {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const params = new URLSearchParams();

  if (query.searchTerm?.trim()) {
    params.set("searchTerm", query.searchTerm.trim());
  }

  if (query.status) {
    params.set("status", query.status);
  }

  params.set("page", String(query.page ?? 1));

  params.set("limit", String(query.limit ?? 10));

  const res = await fetch(`${API_BASE_URL}/rentals?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch your rentals");
  }

  return data;
}

export async function cancelRentalService(rentalId: string) {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(
    `${API_BASE_URL}/rentals/tenant/requests/${rentalId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "CANCELED",
      }),
      cache: "no-store",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to cancel rental");
  }

  return data;
}

export async function getTenantStatsService() {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/tenant/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch tenant stats");
  }

  return data.data;
}
