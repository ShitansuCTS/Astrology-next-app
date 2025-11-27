import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    throw new Error("⚠️ MONGO_URL is missing in environment variables");
}

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(MONGO_URL);
        isConnected = true;
        console.log("✅ MongoDB Connected...............");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
    }
};
