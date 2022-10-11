const mongoose = require("mongoose");

const mongooseString =
  "mongodb+srv://barber_admin:wiQRm2EVnv3rHFUB@cap805.wq8lwr7.mongodb.net/barber_bookings?retryWrites=true&w=majority";

module.exports.connect = async () => {
  await mongoose.connect(mongooseString, { useNewUrlParser: true });
};

module.exports.closeDatabase = async () => {
  await mongoose.connection.close();
}