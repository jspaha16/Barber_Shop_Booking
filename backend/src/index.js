const mongoose = require("mongoose");
const app = require("./app");
const db = require("./db");

require("dotenv").config();

const port = process.env.PORT || 3030;

db.connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening: http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));
