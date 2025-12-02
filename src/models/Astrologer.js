import mongoose from "mongoose";
import Counter from "./Counter.js"; // import counter model

const AstrologerSchema = new mongoose.Schema({
    astroId: { type: String, unique: true },
    fname: { type: String, required: true, trim: true },
    lname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    profilePic: { type: String, default: "" },
    role: { type: String, enum: ["user", "superAdmin"], default: "user" },

    // ⭐ ADD THESE NEW FIELDS ⭐
    plan: {
        type: String,
        enum: ["free", "premium"],
        default: "free",
    },

    dailyQuestionsUsed: {
        type: Number,
        default: 0,
    },

    dailyResetDate: {
        type: String, // storing "YYYY-MM-DD"
        default: "",
    },


    createdAt: { type: Date, default: Date.now },
});

AstrologerSchema.pre("save", async function () {
    if (!this.isNew) return;

    const counter = await Counter.findByIdAndUpdate(
        { _id: "astrologer" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    const paddedNumber = String(counter.seq).padStart(4, "0");
    this.astroId = `AST_CTS_${paddedNumber}`;
});


const Astrologer = mongoose.models.Astrologer || mongoose.model("Astrologer", AstrologerSchema);
export default Astrologer;
