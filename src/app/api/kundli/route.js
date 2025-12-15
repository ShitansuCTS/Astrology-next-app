import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Client from "@/models/Client";
import Kundli from "@/models/Kundli";

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

        // Collect payload
        const { clientId } = await req.json();
        if (!clientId)
            return NextResponse.json({ message: "Client ID required" }, { status: 400 });

        // Check if Kundli already exists
        const existingKundli = await Kundli.findOne({ clientId });
        if (existingKundli) {
            return NextResponse.json({
                message: "Kundli already exists",
                kundli: existingKundli
            }, { status: 200 });
        }

        // Fetch client
        const client = await Client.findById(clientId).lean();
        if (!client)
            return NextResponse.json({ message: "Client not found" }, { status: 404 });

        // Geo convert address
        const addressQuery = `${client.address}, India`;
        const geoResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressQuery)}&format=json&limit=1&addressdetails=1`
        );
        const geoData = await geoResponse.json();


        // console.log("The geoData is  :", geoData);

        if (!geoData?.length)
            return NextResponse.json({ message: "Invalid address" }, { status: 400 });

        const { lat, lon } = geoData[0];

        // Call astrology API
        const astroResponse = await fetch(
            "https://json.freeastrologyapi.com/planets",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.ASTROLOGY_API_KEY
                },
                body: JSON.stringify({
                    year: new Date(client.dob).getFullYear(),
                    month: new Date(client.dob).getMonth() + 1,
                    date: new Date(client.dob).getDate(),
                    hours: parseInt(client.tob.split(":")[0]),
                    minutes: parseInt(client.tob.split(":")[1]),
                    seconds: 0,
                    latitude: Number(lat),
                    longitude: Number(lon),
                    timezone: 5.5,
                    settings: {
                        observation_point: "topocentric",
                        ayanamsha: "lahiri"
                    }
                })
            }
        );

        const astroData = await astroResponse.json();

        // console.log("Astro API response:", astroData);

        // Safely extract output
        const output0 = astroData.output?.[0] || {};
        const output1 = astroData.output?.[1] || {};

        // Ayanamsa and planets
        const ayanamsa = output0?.[13]?.value || 0;
        const planets = output1 || {};

        // console.log("Ayanamsa:", ayanamsa);
        // console.log("Planets:", planets);



        // ---- Save in DB (use output[1] for planets)
        const kundli = await Kundli.create({
            clientId,
            dob: client.dob,
            lat: Number(lat),
            lon: Number(lon),
            timezone: 5.5,
            ayanamsa,
            planets,
            houses: {},    // you can fill later if needed
            charts: {},
            panchang: {},
            matchMaking: {}
        });

        // console.log("Kundli addd to the dv......")

        return NextResponse.json(
            { message: "Kundli generated successfully", kundli },
            { status: 201 }
        );

    } catch (error) {
        console.error("Kundli generation error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}




export async function GET(req) {
    try {
        await connectDB();

        // Validate token from cookies
        const token = req.cookies.get("auth_token")?.value;
        if (!token)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded)
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });

        // Get clientId from query params
        const clientId = req.nextUrl.searchParams.get("clientId");
        if (!clientId)
            return NextResponse.json({ message: "Client ID required" }, { status: 400 });

        // Fetch Kundli for the client
        const kundli = await Kundli.findOne({ clientId }).lean();
        if (!kundli)
            return NextResponse.json({ message: "Kundli not found" }, { status: 404 });

        // Send response
        return NextResponse.json({ kundli }, { status: 200 });

    } catch (error) {
        console.error("Fetch Kundli error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}