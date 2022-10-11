const express = require("express");
const path = require("path");
const cors = require("cors");

const api = require("./api");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors(corsOptions));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../../frontend/build")));

app.use("/api", api);

// Anything that doesn't match the above, send back the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../../../frontend/build/index.html'))
})

module.exports = app;
