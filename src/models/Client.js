import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
    // Multi-tenant ownership
    astrologerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Astrologer",
        required: true,
    },

    astrologerUniqueId: {
        type: String, // AST_CTS_0001
        required: true,
    },

    // Personal Details
    name: { type: String, required: true, trim: true }, 
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    gender: { type: String },

    // Birth Details
    dob: { type: Date },            // Date of Birth
    tob: { type: String },          // Time of Birth (string is fine)
    birthplace: { type: String },

    // Address
    address: { type: String, trim: true },

    // Profile Photo
    profilePic: { type: String, default: "" },

    // General Notes (not visit notes)
    notes: { type: String },

}, { timestamps: true });

export default mongoose.models.Client || mongoose.model("Client", ClientSchema);
