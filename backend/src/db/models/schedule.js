const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  barber: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  availability: {
    type: [
      {
        day: {
          type: String,
          required: true,
        },
        startTime: {
          type: Number,
          required: true,
          min: 9,
          max: 21,
        },
        endTime: {
          type: Number,
          required: true,
          min: 13,
          max: 21,
        },
      },
    ],
  },
  status: {
    type: String,
    required: true,
    enum: ["approved", "rejected", "pending"],
  },
});

ScheduleSchema.path("availability").validate((v) => {
  return v[0].endTime > v[0].startTime;
}, "end time must be greater than end time");

const Schedule = mongoose.model("Schedule", ScheduleSchema);

module.exports = Schedule;
