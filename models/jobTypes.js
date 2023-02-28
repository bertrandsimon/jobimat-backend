const mongoose = require("mongoose");

const jobTypeSchema = mongoose.Schema({
  typeName: String,
});

const JobType = mongoose.model("jobtypes", jobTypeSchema);

module.exports = JobType;
