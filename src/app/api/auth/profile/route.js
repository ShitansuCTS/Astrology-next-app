import { NextResponse } from "next/server";
import Astrologer from "@/models/Astrologer";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export async function GET(req) {
    try {
        await connectDB();

        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

        const user = await Astrologer.findById(decoded.id).select("-password");
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json({ user }, { status: 200 });
    } catch (err) {
        console.error("Profile GET Error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}



export async function PUT(req) {
    try {
        await connectDB();

        // Get auth token from cookies
        const token = req.cookies.get("auth_token")?.value;
        if (!token)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded)
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });

        const body = await req.json();
        const { fname, lname, email, phone } = body;

        // Update user in DB
        const updatedUser = await Astrologer.findByIdAndUpdate(
            decoded.id,
            { fname, lname, email, phone },
            { new: true, runValidators: true, select: "-password" } // return updated user
        );

        if (!updatedUser)
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        // console.log("The updated usersois :", updatedUser);
        return NextResponse.json({ user: updatedUser }, { status: 200 });
    } catch (err) {
        console.error("Profile UPDATE Error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}