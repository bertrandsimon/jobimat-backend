require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("./models/connection");

const jobsRouter = require("./routes/jobs");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");
const statsRouter = require("./routes/stats");

var app = express();

const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/jobs", jobsRouter);
app.use("/stats", statsRouter);

app.use("/admin", adminRouter);
module.exports = app;
