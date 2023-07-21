require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/conn");
const router = require("./Routes/router");
const port = process.env.port || 80;
const path = require("path");

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "frontend/build/index.html"));
});

app.use(router);

app.listen(port, () => {
  console.log("server start");
});
