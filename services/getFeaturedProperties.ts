async function getFeaturedProperties() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/properties?limit=4&sortBy=createdAt&sortOrder=desc`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data.properties || [];
  } catch {
    return [];
  }
}

export default getFeaturedProperties;
