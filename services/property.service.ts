"use server";

import { PropertyFilterValues } from "@/schemas/property.schema";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.BACKEND_API_URL as string;

async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function getPropertiesService(filters: PropertyFilterValues) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else {
        params.append(key, String(value));
      }
    }
  });

  const res = await fetch(`${API_BASE_URL}/properties?${params.toString()}`, {
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch properties");
  }

  return data;
}

export async function getCategoriesService() {
  const res = await fetch(`${API_BASE_URL}/category`, {
    cache: "force-cache",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch categories");
  }

  return data;
}

export async function getAmenitiesService() {
  const res = await fetch(`${API_BASE_URL}/amenities`, {
    cache: "force-cache",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch amenities");
  }

  return data;
}

export async function getPropertyService(
  id: string,
  role?: "ADMIN" | "LANDLORD" | "TENANT",
) {
  const token = await getAccessToken();

  const endpoint =
    role === "ADMIN"
      ? `${API_BASE_URL}/admin/properties/${id}`
      : `${API_BASE_URL}/properties/${id}`;

  const res = await fetch(endpoint, {
    cache: "no-store",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch property");
  }

  return data;
}

export async function savePropertyService(
  propertyId: string | null,
  payload: unknown,
) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const isEdit = !!propertyId;

  const endpoint = isEdit
    ? `${API_BASE_URL}/landlord/properties/${propertyId}`
    : `${API_BASE_URL}/landlord/properties`;

  const res = await fetch(endpoint, {
    method: isEdit ? "PATCH" : "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || `Failed to ${isEdit ? "update" : "create"} property`,
    );
  }

  return data;
}

export async function deletePropertyService(propertyId: string) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/landlord/properties/${propertyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete property");
  }

  return data;
}
