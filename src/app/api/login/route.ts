import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "All users fetched!" });
}

export async function POST(req: Request) {
    const body = await req.json();

    return NextResponse.json({
        message: "User created successfully!",
        data: body,
    });
}
