const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  charge: {
    type: Number,
    required: true,
  },
});

const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
