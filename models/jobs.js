const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  title: String,
  description: String,
  contract: { type: mongoose.Schema.Types.ObjectId, ref: "contract" },
  date: Date,
  reference: String,
  store: [{ type: mongoose.Schema.Types.ObjectId, ref: "stores" }],
  jobType: [{ type: mongoose.Schema.Types.ObjectId, ref: "job_types" }],
  isTopOffer: Boolean,
  isValidated: Boolean,
  candidateFound: Boolean,
  isDisplayed: Boolean,
  jobImage: String,
});

const Job = mongoose.model("jobs", jobSchema);

module.exports = Job;
