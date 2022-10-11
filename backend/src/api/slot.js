const router = require("express").Router();
const { Schedule, User, Slot, Appointment } = require("../db/models");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

router.post("/getSlots", async (req, res, next) => {
  const { barber, date } = req.body;
  const parsedDate = new Date(date);
  const dateBefore = new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate() - 1
  );
  const dateAfter = new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate() + 1
  );

  if (!barber || !date) {
    res.status(400).json({ message: "Please provide a barber id and a date" });
    return;
  }

  try {
    const user = await User.findById(barber);

    if (user === null || !["bb", "mg"].includes(user.userType)) {
      res.status(400).json({ message: "Please provide a valid barber id" });
      return;
    }

    const schedule = await Schedule.findOne({ barber });

    if (!schedule) {
      res
        .status(400)
        .json({ message: "The barber does not have a schedule yet" });

      return;
    }

    const bookedAppointments = await Appointment.find({
      barber,
      status:"scheduled",
      date: {
        $gt: dateBefore,
        $lt: dateAfter,
      },
    }).select("timeSlot");

    const processedAppointments = bookedAppointments.map(
      (appointment) => appointment.timeSlot
    );

    const slots = await Slot.find({
      barber,
      day: days[parsedDate.getDay()],
      _id: { $nin: processedAppointments },
    }).select("display");

    res.status(200).json({ slots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
