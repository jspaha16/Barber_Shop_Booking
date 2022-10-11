const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  barber: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  display: { type: String, required: true },
  day: {
    type: String,
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
});

const Slot = mongoose.model("Slot", SlotSchema);

module.exports = Slot;
