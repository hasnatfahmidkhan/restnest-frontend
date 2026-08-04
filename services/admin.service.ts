"use server";

import { AdminUserQuery, UserStatus } from "@/hooks/use-admin-users";
import { AdminPropertyQuery } from "@/hooks/useAdminProperties";
import { AdminRentalQuery } from "@/hooks/useAdminRentals";
import { getValidAccessToken } from "./getValidAccessToken";

const API_BASE_URL = process.env.BACKEND_API_URL as string;

export type TAdminProperty = {
  id: string;
  title: string;
  description: string;
  rentPrice: string;
  address: string;
  city: string;
  division: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  isAvailable: boolean;
  categoryId: string;
  landlordId: string;
  createdAt: string;
  updatedAt: string;

  landlord: {
    id: string;
    name: string | null;
    email: string;
  };

  category: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };

  propertyImages: {
    id: string;
    url: string;
    isPrimary: boolean;
    propertyId: string;
    createdAt: string;
  }[];

  _count: {
    rentalRequests: number;
  };

  rentalRequests: {
    review: string | null;
  }[];
};

export type TAdminPropertyResponse = TAdminProperty[];

export async function getAdminUsersService(query: AdminUserQuery) {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const res = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data;
}

export async function updateUserStatusService(
  userId: string,
  status: UserStatus,
) {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update user status");
  }

  return data;
}

export async function getAdminPropertiesService(query: AdminPropertyQuery) {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const res = await fetch(
    `${API_BASE_URL}/admin/properties?${params.toString()}`,
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
    throw new Error(data.message || "Failed to fetch properties");
  }

  return data;
}

export async function getAdminRentalsService(query: AdminRentalQuery) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const res = await fetch(
    `${API_BASE_URL}/admin/rentals?${params.toString()}`,
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

export async function getAdminStatsService() {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/admin/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch admin stats");
  }

  return data.data;
}
