"use server";
import { cookies } from "next/headers";

export const deleteCookie = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};
