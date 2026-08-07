"use server";

export type PopularLocation = {
  location: string;
  propertyCount: number;
};

export async function getPopularLocations(): Promise<PopularLocation[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/properties/popular-locations`,
      {
        next: { revalidate: 3600 }, // Cache this data for 1 hour
      },
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch popular locations:", error);
    return [];
  }
}
