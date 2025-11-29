import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        astrologerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Astrologer",
            required: true,
        },
        text: { type: String, required: true },

        // Optional but useful fields
        visitDate: { type: Date, default: Date.now },
    },
    { timestamps: true } // createdAt, updatedAt
);

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
