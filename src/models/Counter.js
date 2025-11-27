import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  _id: { type: String }, // name of the sequence, e.g., "astrologer"
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);
export default Counter;
