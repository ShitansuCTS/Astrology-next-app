import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Astrologer from "@/models/Astrologer";



connectDB();

export async function POST(req) {
    try {
        const { fname, lname, email, password, phone, profilePic } = await req.json();

        // 1️⃣ Input validation
        if (!fname || !lname || !email || !password) {
            return NextResponse.json(
                { message: "Name, email, and password are required." },
                { status: 400 }
            );
        }

        // 2️⃣ Check if astrologer already exists
        const existingAstrologer = await Astrologer.findOne({ email: email.toLowerCase() });
        if (existingAstrologer) {
            return NextResponse.json(
                { message: "Email is already registered." },
                { status: 409 }
            );
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Create new astrologer
        const astrologer = new Astrologer({
            fname,
            lname,
            email: email.toLowerCase(),
            password: await bcrypt.hash(password, 10),
            phone: phone || "",
            profilePic: profilePic || "",
            // astroId is automatically generated via schema default
        });

        await astrologer.save();

        console.log("Signup Success:", astrologer);

        // 5️⃣ Return success response (without password)
        return NextResponse.json(
            {
                message: "Astrologer registered successfully",
                astrologer: {
                    astroId: astrologer.astroId,
                    fname: astrologer.fname,
                    lname: astrologer.lname,
                    email: astrologer.email,
                    phone: astrologer.phone,
                    profilePic: astrologer.profilePic,
                    createdAt: astrologer.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error." },
            { status: 500 }
        );
    }
}
