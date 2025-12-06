import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json(
            { message: "Logout successful" },
            { status: 200 }
        );

        // Delete the cookie by setting it to empty & expired
        response.cookies.set("auth_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(0), // expire immediately
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { message: "Logout failed", error: error.message },
            { status: 500 }
        );
    }
}
