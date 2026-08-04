"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.BACKEND_API_URL as string;

async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function submitReviewService(
  rentalId: string,
  payload: {
    rating: number;
    comment: string;
  },
) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/reviews/${rentalId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to submit review");
  }

  return data;
}

export async function getMyReviewsService() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/reviews/my-reviews`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch your reviews");
  }

  return data;
}

export async function updateReviewService(
  reviewId: string,
  payload: {
    rating: number;
    comment: string;
  },
) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update review");
  }

  return data;
}