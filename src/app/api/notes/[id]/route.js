import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Notes";
import { verifyToken } from "@/lib/jwt";


export async function PUT(req, { params }) {
    try {
        await connectDB();

        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

        const { id } = await params; // note ID from URL
        const body = await req.json();
        const { text } = body;

        if (!text) return NextResponse.json({ message: "Text is required" }, { status: 400 });

        const note = await Note.findById(id);
        if (!note) return NextResponse.json({ message: "Note not found" }, { status: 404 });

        // Only allow the astrologer who created the note to edit
        if (note.astrologerId.toString() !== decoded.id)
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        note.text = text;
        await note.save();

        return NextResponse.json({ message: "Note updated", note }, { status: 200 });
    } catch (err) {
        console.error("Error updating note:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}




export async function DELETE(request, { params }) {
    await connectDB();

    const { id } = await params;

    try {
        const deleted = await Note.findByIdAndDelete(id);

        if (!deleted) {
            return Response.json(
                { message: "Note not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { message: "Note deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { message: error.message },
            { status: 500 }
        );
    }
}