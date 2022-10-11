const router = require("express").Router();
const { Service } = require("../db/models");

router.get("/getServices", async (req, res, next) => {
  const services = await Service.find({});
  res.send({ services });
});


module.exports = router;
