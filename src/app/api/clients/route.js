import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Client from "@/models/Client";
import Astrologer from "@/models/Astrologer";

export async function POST(req) {
    try {
        await connectDB();

        // Validate token
        const token = req.cookies.get("auth_token")?.value;
        if (!token)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded)
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });

        // Fetch the astrologer (owner)
        const astrologer = await Astrologer.findById(decoded.id);
        if (!astrologer)
            return NextResponse.json({ message: "Astrologer not found" }, { status: 404 });

        // Collect client data
        const data = await req.json();
        const {
            name,
            phone,
            email,
            gender,
            dob,
            tob,
            birthplace,
            address,
            notes,
            profilePic
        } = data;

        // Basic validation
        if (!name)
            return NextResponse.json({ message: "Client  name is required" }, { status: 400 });

        // Creating client linked to astrologer
        const newClient = await Client.create({
            astrologerId: astrologer._id,
            astrologerUniqueId: astrologer.astroId,
            name,
            phone,
            email,
            gender,
            dob,
            tob,
            birthplace,
            address,
            notes,
            profilePic
        });
        console.log("New Client:", newClient);
        return NextResponse.json(
            { message: "Client added successfully", client: newClient },
            { status: 201 }
        );


    } catch (error) {
        console.error("Add Client Error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}



export async function GET(req) {
    try {
        await connectDB();

        // Validate token
        const token = req.cookies.get("auth_token")?.value;
        if (!token)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded)
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });

        // Fetch clients for this astrologer only
        const clients = await Client.find({ astrologerId: decoded.id }).sort({ createdAt: -1 });

        return NextResponse.json({ clients }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
