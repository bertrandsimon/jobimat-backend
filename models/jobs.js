const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  title: String,
  description: String,
  contract: { type: mongoose.Schema.Types.ObjectId, ref: "contracts" },
  date: Date,
  reference: String,
  store: { type: mongoose.Schema.Types.ObjectId, ref: "stores" },
  job_type: { type: mongoose.Schema.Types.ObjectId, ref: "job_types" },
  is_top_offer: Boolean,
  is_validated: Boolean,
  candidate_found: Boolean,
  is_displayed: Boolean,
});

const Job = mongoose.model("jobs", jobSchema);

module.exports = Job;
