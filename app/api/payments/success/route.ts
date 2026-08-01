/* eslint-disable @typescript-eslint/no-unused-vars */
import { getNewAccesssToken } from "@/services/getNewAccesssToken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { success: false, message: "Session ID is missing" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    const refreshResult = await getNewAccesssToken();
    if (!refreshResult?.success || !refreshResult.data?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    accessToken = refreshResult.data.accessToken;
  }

  try {
    // Assuming your backend can fetch payment details by session_id.
    // If your backend uses a different route like /payments/session/:id, update it here.
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payments/session/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
