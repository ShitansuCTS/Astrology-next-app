import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Appointment from "@/models/Appointment";
import Client from "@/models/Client";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { clientId, astrologerId, date, timeSlot, notes } = body;

        // Validate required fields
        if (!clientId || !astrologerId || !date || !timeSlot) {
            return NextResponse.json(
                { message: "Missing required fields" },
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

        // Ensure astrologer is creating his own appointments
        if (decoded.id !== astrologerId) {
            return NextResponse.json(
                { message: "You cannot create appointments for other astrologers" },
                { status: 403 }
            );
        }

        // Validate client exists
        const client = await Client.findById(clientId);
        if (!client)
            return NextResponse.json(
                { message: "Client not found" },
                { status: 404 }
            );

        // Create appointment
        const appointment = await Appointment.create({
            clientId,
            astrologerId,
            date,
            timeSlot,
            notes: notes || "",
            status: "scheduled",
        });

        return NextResponse.json(
            { message: "Appointment created", appointment },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}






export async function GET(req) {
    try {
        await connectDB();

        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const clientId = searchParams.get("clientId");

        // Fetch all appointments for this astrologer
        let query = { astrologerId: decoded.id }; // always filter by logged-in astrologer

        if (clientId) {
            query.clientId = clientId; // optionally filter by client
        }

        const appointments = await Appointment.find(query).sort({ date: 1, timeSlot: 1 });

        return NextResponse.json({ appointments }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}