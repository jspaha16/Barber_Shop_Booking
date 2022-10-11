const router = require("express").Router();
const { Appointment } = require("../db/models");

// find appointments by user id (barber or customer)
router.get("/getAppointment", async (req, res, next) => {
  const { type, userId } = req.query;

  if (!userId || !type || userId == "undefined") {
    res.status(400).json({ message: "Please provide a user id and type" });
    return;
  }

  const appointments = await Appointment.find({ [type]: userId })
    .populate({
      path: "barber",
      select: ["fname", "lname"],
    })
    .populate({
      path: "services",
      select: ["name"],
    })
    .populate({ path: "timeSlot", select: ["display"] });

  res.json({ appointments }).status(200);
});

router.post("/createAppointment", async (req, res, next) => {
  const appointmentDate = new Date(req.body.date);
  const serverDate = new Date();
 
  const { timeSlot, barber, services, customer } = req.body;

  if (!barber || services.length < 1 || !timeSlot || !customer) {
    res.status(400).json({ message: "Don't leave empty fields" });
  } else {
    if (appointmentDate < serverDate) {
      res.status(400).json({ message: "Please select a valid date" });
    } else {
      req.body.status = "scheduled";
      try {
        const appointment = await Appointment.create(req.body);
        res.send({ appointment }).status(200);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  }
});

router.put("/deleteAppointment", async (req, res, next) => {
  const id = req.query.id;
  try {
    await Appointment.updateOne({ _id: id }, [
      { $set: { status: "cancelled" } },
    ]);
    res.status(200).json({ message: "Appointment cancelled successfuly !" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Your appointment could not be cancelled!" });
    return;
  }
});

router.put("/deleteAppointmentByDateAndBarber",async(req,res,next)=>{
  const {date,barber} = req.query;
  const d1= new Date(date);
 const updateresult=await Appointment.updateMany({date:d1,barber,status:"scheduled"},
  [
  { $set: { status:"cancelled"} }
  ]);

  if(updateresult.modifiedCount>0 && updateresult.matchedCount>0)
  {
    res.status(200).json({message:"Successfully Updated All Records"})
  }else if(updateresult.matchedCount ==0)
  {
    res.status(400).json({message:"No Data Found"})
  }
})

router.put("/changeStatus", async (req, res, next) => {
  const { id, status } = req.query;

  if (!id || !status) {
    res.status(400).json({ message: "Don't leave empty fields" });
    return;
  }

  try {
    await Appointment.updateOne({ _id: id }, { status });
    res.status(200).json({ message: "Status updated successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Your appointment could not be cancelled!" });
    return;
  }
});

router.get("/getAppointmentsByDateAndBarber", async (req, res, next) => {
  const { barber, date } = req.query;
  
  if (barber == "" || date == "") {
    res.status(400).json({ message: "Invalid Request" });
  } else {
    const appointments = await Appointment.find({
      barber,
      date,
      status: "scheduled",
    })
      .populate({
        path: "customer",
        select: ["fname", "lname"],
      })
      .populate({
        path: "timeSlot",
        select: ["display"],
      });
    //Changes Nirmal End
    if (appointments.length > 0) {
      res.status(200).json({ appointments });
    } else {
      res
        .status(400)
        .json({ message: "No Appointments Found", appointments: [] });
    }
  }
});

module.exports = router;
