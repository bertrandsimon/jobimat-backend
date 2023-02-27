const mongoose = require("mongoose");

const contractSchema = mongoose.Schema({
  type: String,
  duration: String,
  probation: String,
});

const Contract = mongoose.model("contracts", contractSchema);

module.exports = Contract;
