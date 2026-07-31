import { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { match } from "path-to-regexp";
import { jwtUtils } from "./lib/jwt";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "./routes";

// 1. Initialize matchers once (Performance Boost)
const publicMatchers = PUBLIC_ROUTES.map((route) =>
  match(route, { decode: decodeURIComponent }),
);
const authMatchers = AUTH_ROUTES.map((route) =>
  match(route, { decode: decodeURIComponent }),
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes early
  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyJWTToken(accessToken, process.env.JWT_ACCESS_SECRET!)
    : null;
  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyJWTToken(refreshToken, process.env.JWT_REFRESH_SECRET!)
    : null;

  // Create a base response so cookies can be set on it
  const response = NextResponse.next();

  // 2. Token Refresh Logic (with Try-Catch)
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            // Pass the refresh token from the request cookies
            Cookie: `refreshToken=${refreshToken}`,
          },
          cache: "no-store",
        },
      );

      const result = await res.json();
      if (result?.success && result.data?.accessToken) {
        const newAccessToken = result.data.accessToken as string;

        // Set the new token in the response cookies
        response.cookies.set("accessToken", newAccessToken, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 1, // 1 day
          path: "/",
        });

        accessToken = newAccessToken;
        decodedAccessToken = jwtUtils.verifyJWTToken(
          accessToken,
          process.env.JWT_ACCESS_SECRET as string,
        );
      }
    } catch (error) {
      console.error("Middleware: Error refreshing token", error);
    }
  }

  let userRole: string | null = null;

  // 3. Invalid Token Cleanup
  if (!decodedAccessToken?.success) {
    // Delete from response if token is missing or invalid
    response.cookies.delete("accessToken");
    accessToken = undefined;
  } else if (decodedAccessToken.verifiedToken) {
    userRole = (decodedAccessToken.verifiedToken as JwtPayload).role || null;
  }

  // 4. Path Matching
  const isAuthRoute = authMatchers.some((matcher) => !!matcher(pathname));
  const isPublicRoute = publicMatchers.some((matcher) => !!matcher(pathname));

  // 5. Auth Route Logic (Logged in user shouldn't see login/register)
  if (accessToken && isAuthRoute) {
    const redirectUrl =
      userRole === "TENANT"
        ? "/dashboard/tenant"
        : userRole === "ADMIN"
          ? "/dashboard/admin"
          : userRole === "LANDLORD"
            ? "/dashboard/landlord"
            : "/";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // 6. Protected Route Logic (Not logged in user shouldn't see dashboard)
  if (!accessToken && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 7. Role-Based Access Control
  if (pathname.startsWith("/dashboard/tenant") && userRole !== "TENANT") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
  if (pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
  if (pathname.startsWith("/dashboard/landlord") && userRole !== "LANDLORD") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // 8. Return response along with updated cookies
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\png$).*)",
  ],
};
