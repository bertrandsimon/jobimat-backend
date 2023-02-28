const mongoose = require("mongoose");

const jobTypeSchema = mongoose.Schema({
  typeName: String,
});

const JobType = mongoose.model("jobTypes", jobTypeSchema);

module.exports = JobType;
