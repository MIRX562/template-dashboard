import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define route types
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/forgot-password",
  "/about",
  "/terms",
  "/privacy",
];

const authRoutes = ["/auth/login", "/auth/register", "/forgot-password"];

const protectedRoutes = ["/dashboard", "/profile", "/settings", "/admin"];

// Utility function to check if URL matches any of the paths
function matchesPath(url: string, paths: string[]): boolean {
  return paths.some(
    (path) => url.startsWith(path) || url === path.replace(/\/$/, "")
  );
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value ?? null;
  const isAuthenticated = token !== null;

  // CORS and security checks for non-GET requests
  if (request.method !== "GET") {
    const originHeader = request.headers.get("Origin");
    const hostHeader = request.headers.get("Host");

    if (originHeader === null || hostHeader === null) {
      return new NextResponse(null, { status: 403 });
    }

    let origin: URL;
    try {
      origin = new URL(originHeader);
    } catch {
      return new NextResponse(null, { status: 403 });
    }

    if (origin.host !== hostHeader) {
      return new NextResponse(null, { status: 403 });
    }
  }

  // Handle authentication flow
  const response = NextResponse.next();

  // Extend session cookie on GET requests
  if (request.method === "GET" && isAuthenticated) {
    response.cookies.set("session", token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  // Route protection logic
  const isAuthRoute = matchesPath(pathname, authRoutes);
  const isProtectedRoute = matchesPath(pathname, protectedRoutes);
  const isPublicRoute = matchesPath(pathname, publicRoutes);

  // Redirect authenticated users away from auth routes
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to auth/login from protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Public routes are accessible to all
  if (isPublicRoute) {
    return response;
  }

  // API routes protection
  if (pathname.startsWith("/api/")) {
    // Public API endpoints
    const publicApiRoutes = ["/api/auth", "/api/public"];
    if (matchesPath(pathname, publicApiRoutes)) {
      return response;
    }

    // Protected API endpoints
    if (!isAuthenticated) {
      return new NextResponse(null, { status: 401 });
    }
  }

  return response;
}

// Configure which routes should be handled by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
