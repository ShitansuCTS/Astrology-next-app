import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Astrologer from "@/models/Astrologer";
import { connectDB } from "@/lib/db";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await Astrologer.findOne({ email });
        if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

        const token = signToken({ id: user._id, email: user.email, role: user.role });

        const response = NextResponse.json({
            message: "Login successful",
            user: {
                astroId: user.astroId,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                role: user.role,
            },
        });

        // Set token in secure HttpOnly cookie
        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only HTTPS in prod
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
