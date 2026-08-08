"use server";

import { getValidAccessToken } from "./getValidAccessToken";

const API_BASE_URL = process.env.BACKEND_API_URL as string;

export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELED";

export interface LandlordRental {
  id: string;
  status: RentalStatus;
  moveInDate: string;
  leaseMonths: number;
  endDate: string;
  createdAt: string;

  tenant: {
    id: string;
    name: string | null;
    email: string;
  };

  property: {
    id: string;
    title: string;
    rentPrice: string;
    city: string;
    division: string;
  };
}

export interface LandlordRentalsQuery {
  searchTerm?: string;
  status?: RentalStatus;
  page?: number;
  limit?: number;
}

export interface LandlordRentalsResponse {
  success: boolean;
  message: string;
  data: {
    rentals: LandlordRental[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export async function getLandlordRentalsService(
  query: LandlordRentalsQuery,
): Promise<LandlordRentalsResponse> {
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

  if (query.page) {
    params.set("page", String(query.page));
  }

  if (query.limit) {
    params.set("limit", String(query.limit));
  }

  const queryString = params.toString();

  const res = await fetch(
    `${API_BASE_URL}/rentals/landlord${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

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
