import { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { match } from "path-to-regexp";
import { jwtUtils } from "./lib/jwt";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "./routes";

const publicMatchers = PUBLIC_ROUTES.map((route) =>
  match(route, { decode: decodeURIComponent }),
);

const authMatchers = AUTH_ROUTES.map((route) =>
  match(route, { decode: decodeURIComponent }),
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyJWTToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      )
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyJWTToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      )
    : null;

  const response = NextResponse.next();

  /**
   * Refresh access token if expired but refresh token is valid
   */
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    try {
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
          cache: "no-store",
        },
      );

      if (refreshResponse.ok) {
        const result = await refreshResponse.json();

        if (result.success && result.data?.accessToken) {
          accessToken = result.data.accessToken as string;

          response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24,
          });

          decodedAccessToken = jwtUtils.verifyJWTToken(
            accessToken,
            process.env.JWT_ACCESS_SECRET as string,
          );
        }
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  }

  /**
   * Authentication state
   */
  const isAuthenticated = decodedAccessToken?.success === true;

  const user = isAuthenticated
    ? (decodedAccessToken!.verifiedToken as JwtPayload)
    : null;

  const userRole = user?.role ?? null;

  /**
   * Cleanup invalid cookies
   */
  if (!isAuthenticated) {
    response.cookies.delete("accessToken");

    if (!decodedRefreshToken?.success) {
      response.cookies.delete("refreshToken");
    }
  }

  /**
   * Route matching
   */
  const isAuthRoute = authMatchers.some((matcher) => matcher(pathname));
  const isPublicRoute = publicMatchers.some((matcher) => matcher(pathname));

  /**
   * Logged-in users shouldn't access login/register
   */
  if (isAuthenticated && isAuthRoute) {
    const redirectPath =
      userRole === "ADMIN"
        ? "/dashboard/admin"
        : userRole === "LANDLORD"
          ? "/dashboard/landlord"
          : userRole === "TENANT"
            ? "/dashboard/tenant"
            : "/";

    const redirect = NextResponse.redirect(new URL(redirectPath, request.url));

    // Preserve refreshed cookie
    const refreshedToken = response.cookies.get("accessToken");
    if (refreshedToken) {
      redirect.cookies.set(refreshedToken);
    }

    return redirect;
  }

  /**
   * Protected routes
   */
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);

    const redirect = NextResponse.redirect(loginUrl);

    response.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie);
    });

    return redirect;
  }

  /**
   * RBAC
   */
  if (pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  if (pathname.startsWith("/dashboard/landlord") && userRole !== "LANDLORD") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  if (pathname.startsWith("/dashboard/tenant") && userRole !== "TENANT") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)",
  ],
};
