import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Client from "@/models/Client";
// import Note from "@/models/Note";

export async function GET(req) {
    try {
        await connectDB();

        // Get query params
        const { searchParams } = new URL(req.url);
        const clientId = searchParams.get("clientId");
        // const astrologerId = searchParams.get("astrologerId");

        if (!clientId) {
            return NextResponse.json(
                { message: "Client ID  ID required" },
                { status: 400 }
            );
        }

        // Validate token
        const token = req.cookies.get("auth_token")?.value;
        if (!token)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded)
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });

        // Optional: Ensure the token's astrologerId matches query
        // if (decoded.id !== astrologerId)
        //     return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        // Fetch client
        const client = await Client.findById(clientId).lean();
        if (!client) return NextResponse.json({ message: "Client not found" }, { status: 404 });

        // Fetch notes for this client & astrologer
        // const notes = await Note.find({ clientId, astrologerId }).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ client }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
