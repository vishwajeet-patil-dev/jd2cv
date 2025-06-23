require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(require("./routes/index"));
module.exports = app;
