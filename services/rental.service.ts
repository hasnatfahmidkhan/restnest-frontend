"use server";

import { getValidAccessToken } from "./getValidAccessToken";

const API_BASE_URL = process.env.BACKEND_API_URL as string;

export async function getLandlordRentalsService() {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/rentals/landlord`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch rentals");
  }

  return data;
}

export async function getRentalDetailsService(
  rentalId: string,
  tenantId: string,
) {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/rentals/${rentalId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tenantId }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch rental details");
  }

  return data;
}

export async function updateRentalStatusService(
  rentalId: string,
  status: "APPROVED" | "REJECTED",
) {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(
    `${API_BASE_URL}/rentals/landlord/requests/${rentalId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update rental status");
  }

  return data;
}
