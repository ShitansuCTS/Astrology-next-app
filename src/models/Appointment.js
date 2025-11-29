import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        astrologerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Astrologer",
            required: true,
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        timeSlot: {
            type: String,
            required: true,
            // Example: "10:00 AM - 10:30 AM"
        },
        status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled"],
            default: "scheduled",
        },
        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

const Appointment =
    mongoose.models.Appointment ||
    mongoose.model("Appointment", appointmentSchema);

export default Appointment;
