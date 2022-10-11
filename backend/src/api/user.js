const router = require("express").Router();
const { User, Schedule, Slot, Appointment } = require("../db/models");

router.get("/getUser/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/getUserByType/:userType", async (req, res, next) => {
  const userType = req.params.userType;

  if (userType) {
    let query;
    if (userType === "barber") {
      query = { userType: { $in: ["bb", "mg"] } };
    } else {
      query = { userType: "cs" };
    }

    const users = await User.find(query).select({ password: 0, userType: 0 });
    res.status(200).json({ users });
  } else {
    res.status(400).json({ message: "Invalid Request" });
  }
});

router.get("/getBarber", async (req, res, next) => {
  const userType = "bb";
  if (userType != "") {
    const user = await User.find({ userType });
    res.status(200).json({ user });
  } else {
    res.status(400).json({ message: "Invalid Request" });
  }
});

router.get("/getActiveBarbers", async (req, res, next) => {
  try {
    const schedules = await Schedule.find({ status: "approved" }).populate({
      path: "barber",
      select: "fname lname",
    });

    const barbers = schedules.map((item) => item.barber);

    res.status(200).json({ barbers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/getUserByEmail/:email", async (req, res, next) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email });

    if (user) {
      res.send({ user });
    } else {
      res.status(400).json({ message: "User with given email not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete user by ID for testing
router.delete("/deleteUser/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    await User.deleteOne({ _id: id });
    res
      .status(200)
      .json({ message: `User with id: ${id} deleted successfully!` });
  } catch (err) {
    res.status(400).json({ message: err.message });
    return;
  }
});

// update a user
router.put("/updateUser/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    await User.updateOne({ _id: id }, [
      {
        $set: {
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
        },
      },
    ]);

    res.status(200).json({ message: `User updated successfully!` });
  } catch (err) {
    res.status(400).json({ message: err.message });
    return;
  }
});

router.put("/removeBarber/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const barber = await User.findOneAndUpdate(
      { _id: id, userType: "bb" },
      { userType: "cs" }
    );

    if (!barber) {
      res.status(400).json({ message: "Please provide a valid barber id" });
    }

    await Schedule.findOneAndDelete({ barber: id });
    await Slot.deleteMany({ barber: id });
    await Appointment.updateMany(
      { barber: id, status: "scheduled" },
      { status: "canceled" }
    );

    res.status(200).json({ message: "Barber removed successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/makeBarber", async (req, res, next) => {
  const { userEmail, managerId } = req.body;
  console.log(req.body);

  if (!userEmail || !managerId) {
    res
      .status(400)
      .json({ message: "Please provide a user email and manager id" });
    return;
  }

  try {
    const user = await User.findOne({ email: userEmail });
    const manager = await User.findById(managerId);

    if (!user || user.userType !== "cs") {
      res.status(400).json({ message: "Please provide a valid user id" });
      return;
    }

    if (!manager || manager.userType !== "mg") {
      res.status(400).json({ message: "Please provide a valid manager id" });
      return;
    }

    const barber = await User.findByIdAndUpdate(
      user._id,
      { userType: "bb" },
      { returnDocument: "after" }
    );

    if (!barber || barber.userType !== "bb") {
      res.status(500).json({ message: "Operation unsuccessful" });
    } else {
      res
        .status(200)
        .json({ message: "User promoted to barber successfully!" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
