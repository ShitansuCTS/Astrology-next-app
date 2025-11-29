import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Notes";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
    try {
        await connectDB();

        const token = req.cookies.get("auth_token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const body = await req.json();
        const { clientId, astrologerId, text } = body;

        if (!clientId || !astrologerId || !text) {
            return NextResponse.json(
                { message: "clientId, astrologerId, and text are required" },
                { status: 400 }
            );
        }

        // Extra safety: only allow logged-in astrologer to add note
        if (decoded.id !== astrologerId) {
            return NextResponse.json(
                { message: "Forbidden: astrologer mismatch" },
                { status: 403 }
            );
        }

        const note = await Note.create({
            clientId,
            astrologerId,
            text,
            visitDate: new Date(),
        });

        return NextResponse.json({ message: "Note added", note }, { status: 201 });

    } catch (error) {
        console.error("Error adding note:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}



export async function GET(req) {
    try {
        await connectDB();

        // Check JWT token
        const token = req.cookies.get("auth_token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        // Extract query params
        const { searchParams } = new URL(req.url);
        const clientId = searchParams.get("clientId");
        const astrologerId = searchParams.get("astrologerId");
        console.log(clientId, astrologerId)

        if (!clientId || !astrologerId) {
            return NextResponse.json(
                { message: "clientId and astrologerId are required" },
                { status: 400 }
            );
        }

        // Safety check — logged-in astrologer can access only own clients
        if (decoded.id !== astrologerId) {
            return NextResponse.json(
                { message: "Forbidden: astrologer mismatch" },
                { status: 403 }
            );
        }

        const notes = await Note.find({ clientId, astrologerId }).sort({ createdAt: -1 });

        return NextResponse.json({ notes }, { status: 200 });

    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

