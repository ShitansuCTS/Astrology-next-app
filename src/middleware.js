import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("auth_token")?.value;
    const url = req.nextUrl.pathname;

    // Public routes (accessible without token)
    const publicRoutes = ["/signin", "/signup"];

    const isPublic = publicRoutes.some((route) => url.startsWith(route));

    // If route is NOT public and token is missing → redirect to signin
    if (!isPublic && !token) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    // If user is already logged in and tries to access login or signup → redirect to home/dashboard
    if (isPublic && token) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

// Apply middleware to ALL pages
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api).*)",
    ],
};

