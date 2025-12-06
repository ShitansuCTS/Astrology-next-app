import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import Astrologer from "@/models/Astrologer";
import Client from "@/models/Client";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
    try {
        await connectDB();

        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

        const { message } = await req.json();
        if (!message) return NextResponse.json({ message: "Missing message" }, { status: 400 });

        const astrologerId = decoded.id;

        // -----------------------------------
        // ⭐ Fetch astrologer first
        // -----------------------------------
        const astrologer = await Astrologer.findById(astrologerId);
        if (!astrologer) {
            return NextResponse.json({ message: "Astrologer not found" }, { status: 404 });
        }

        // -----------------------------------
        // ⭐ DAILY RATE LIMIT SYSTEM
        // -----------------------------------
        const FREE_LIMIT = 3;
        const today = new Date().toISOString().split("T")[0];

        // Reset counter when date changes
        if (astrologer.dailyResetDate !== today) {
            astrologer.dailyQuestionsUsed = 0;
            astrologer.dailyResetDate = today;
            await astrologer.save();
        }

        // Enforce plan limit
        if (astrologer.plan !== "premium") {
            if (astrologer.dailyQuestionsUsed >= FREE_LIMIT) {
                return NextResponse.json(
                    {
                        message: `You have used all ${FREE_LIMIT} free questions for today. Upgrade to premium for unlimited access.`,
                        limitReached: true,
                    },
                    { status: 403 }
                );
            }
        }

        // Count this question
        astrologer.dailyQuestionsUsed += 1;
        await astrologer.save();

        // -----------------------------------
        // ⭐ Fetch data only AFTER rate-limit passes
        // -----------------------------------
        const clients = await Client.find({ astrologerId });
        const appointments = await Appointment.find({ astrologerId });

        const contextData = {
            clients,
            appointments,
            astrologer,
        };

        // ---- AI RESPONSE USING GROQ ----
        const aiResponse = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: `
You are Astox, an AI assistant designed for helping astrologers.

Important Identity Rules:
- The person asking the question is ALWAYS the astrologer: ${astrologer.fname} ${astrologer.lname}.
- NEVER assume the astrologer is a client.
- ONLY give client information when the astrologer explicitly asks about a client by name.
- If the astrologer asks “Who am I?”, reply with: “You are the astrologer ${astrologer.fname} ${astrologer.lname}.”

Data You Can Use:
${JSON.stringify(contextData, null, 2)}

Rules:
1. Use the above data to answer questions ONLY when relevant.
2. Never reveal raw JSON.
3. Never confuse astrologer identity with client identity.
4. If a question is about a client, identify the correct client by name.
5. Keep responses clear, short, and helpful.
6. If no appointments exist, say: "You have no appointments scheduled."
`
                },
                {
                    role: "user",
                    content: message,
                }
            ],
        });

        return NextResponse.json({
            answer: aiResponse.choices[0].message.content,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}
