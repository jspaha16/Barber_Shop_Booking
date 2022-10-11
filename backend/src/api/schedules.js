const router = require("express").Router();
const { Schedule, User, Slot } = require("../db/models");

router.get("/getSchedules", async (req, res, next) => {
  const schedules = await Schedule.find({});
  res.send({ schedules });
});

router.get("/getScheduleByBarber/:barber", async (req, res, next) => {
  const barber = req.params.barber;

  try {
    const schedule = await Schedule.findOne({ barber: barber }).populate({
      path: "barber",
      select: ["fname", "lname", "email"],
    });

    if (!schedule) {
      res.status(400).json({ message: "Please enter a valid barber id" });
      return;
    }

    res.status(200).json({ schedule });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/createSchedule", async (req, res, next) => {
  const schedule = req.body;

  if (!schedule.barber || schedule.availability.length < 1) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  let allTimesValid = false;

  schedule.availability.every((object) => {
    allTimesValid = object.startTime < object.endTime;
    return allTimesValid;
  });

  if (!allTimesValid) {
    res.status(400).json({
      message: "Start time cannot be greater than or equal to end time",
    });

    return;
  }

  try {
    const user = await User.findById(schedule.barber);

    if (user === null || !["bb", "mg"].includes(user.userType)) {
      res.status(400).json({ message: "Please provide a valid barber id" });
      return;
    }

    const existing = await Schedule.findOne({ barber: schedule.barber });

    if (existing) {
      res.status(400).json({ message: "Barber already has a schedule" });
      return;
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }

  schedule.status = "pending";

  try {
    const result = await Schedule.create(schedule);
    res.status(200).json({ schedule: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/updateSchedule", async (req, res, next) => {
  const schedule = req.body;

  if (!schedule.id || schedule.availability.length < 1) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  let allTimesValid = false;

  schedule.availability.every((object) => {
    allTimesValid = object.startTime < object.endTime;
    return allTimesValid;
  });

  if (!allTimesValid) {
    res.status(400).json({
      message: "Start time cannot be greater than or equal to end time",
    });

    return;
  }

  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      schedule.id,
      {
        availability: schedule.availability,
        status: "pending",
      },
      { returnDocument: "after" }
    );

    if (updatedSchedule === null) {
      res.status(400).json({ message: "Please provide a valid schedule id" });
      return;
    }

    res.status(200).json({ schedule: updatedSchedule });
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
});

router.patch("/updateStatus", async (req, res, next) => {
  const { schedule_id, user_id, status } = req.body;

  if (!schedule_id || !user_id || !status) {
    res.status(400).json({ message: "Please provide all the required fields" });
    return;
  }

  try {
    const user = await User.findById(user_id, "userType");

    if (user === null || user.userType !== "mg") {
      res.status(400).json({ message: "Please provide a valid manager id" });
      return;
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      schedule_id,
      {
        status,
      },
      { returnDocument: "after" }
    );

    if (updatedSchedule === null) {
      res.status(400).json({ message: "Please provide a valid schedule id" });
      return;
    }

    await Slot.deleteMany({ barber: updatedSchedule.barber });

    if (updatedSchedule.status === "approved") {
      updatedSchedule.availability.forEach(async (day) => {
        for (let i = day.startTime; i < day.endTime; i++) {
          const display = `${i <= 12 ? i : i - 12} ${i < 12 ? "am" : "pm"} to ${
            i < 12 ? i + 1 : i - 11
          } ${i < 11 ? "am" : "pm"}`;

          await Slot.create({
            barber: updatedSchedule.barber,
            display,
            day: day.day,
          });
        }
      });
    }

    res.status(200).json({ schedule: updatedSchedule });
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
});

router.delete("/deleteSchedule/:id", (req, res, next) => {
  const id = req.params.id;

  Schedule.findByIdAndDelete(id, (err, schedule) => {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    } else if (!schedule) {
      res.status(400).json({ message: "Please provide a valid schedule id" });
      return;
    }

    res.status(200).json({ message: "schedule deleted successfully" });
  });
});

module.exports = router;
