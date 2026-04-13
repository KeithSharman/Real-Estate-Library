import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// UX-level route guard. Firestore rules remain the true authorization layer.
const AUTH_COOKIE_NAME = "firebaseAuth";

// Routes that should bounce unauthenticated users back to sign-in.
function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/admin")
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasAuthCookie = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  if (isProtectedPath(pathname) && !hasAuthCookie) {
    const signInUrl = new URL("/", request.url);
    // Preserve destination so home page sign-in can redirect users back.
    const redirectTarget = `${pathname}${search}`;
    signInUrl.searchParams.set("redirect", redirectTarget);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/courses/:path*", "/admin/:path*"],
};
