import { NextResponse, NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/config/appwrite";

export async function proxy(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE);
  const { pathname } = request.nextUrl;

  // Define public routes
  const publicPaths = [
    "/auth/login",
    "/auth/register",
    "/rooms",
    "/_next",
    "/api",
    "/auth",
  ];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  // Define protected routes
    const userProtectedRoutes = ["/bookings", "/profile", "/rooms/my"];
  const managerProtectedRoutes = ["/manager", "/add-room"];
  const adminProtectedRoutes = ["/admin"];

  const isUserProtected = userProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isManagerProtected = managerProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminProtected = adminProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  //  If logged in user tries to visit login/register → redirect home
  if (
    session &&
    (pathname === "/auth/login" || pathname === "/auth/register")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  //  Allow public routes (short-circuit)
  if (isPublic) {
    return NextResponse.next();
  }

  //  If user not logged in and tries to access protected routes
  if (!session && (isUserProtected || isManagerProtected || isAdminProtected)) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply proxy on all routes except static assets and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)",
  ],
};
