"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function getLandlordRentalsService() {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/rentals/landlord`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
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
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/rentals/${rentalId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
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
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(
    `${API_BASE_URL}/rentals/landlord/requests/${rentalId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
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
