import mongoose from "mongoose";

const planetSchema = new mongoose.Schema({
  current_sign: Number,
  house_number: Number,
  fullDegree: Number,
  normDegree: Number,
  isRetro: Boolean
}, { _id: false });

const kundliSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  dob: { type: Date, required: true },
  lat: Number,
  lon: Number,
  timezone: Number,
  ayanamsa: Number,

  // Store all planets
  planets: {
    Ascendant: planetSchema,
    Sun: planetSchema,
    Moon: planetSchema,
    Mars: planetSchema,
    Mercury: planetSchema,
    Jupiter: planetSchema,
    Venus: planetSchema,
    Saturn: planetSchema,
    Rahu: planetSchema,
    Ketu: planetSchema,
    Uranus: planetSchema,
    Neptune: planetSchema,
    Pluto: planetSchema
  },

  houses: Object,    // Optional: Bhavas info if needed
  charts: Object,    // Optional: D1, D9 charts
  panchang: Object,  // Optional: tithi, nakshatra
  matchMaking: Object, // Optional: ashtakoot result

  generatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.models.Kundli || mongoose.model("Kundli", kundliSchema);
