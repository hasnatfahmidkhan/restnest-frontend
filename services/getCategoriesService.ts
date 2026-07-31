async function getCategoriesService() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return [];
  }
}

export default getCategoriesService;
