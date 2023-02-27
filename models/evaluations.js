const mongoose = require("mongoose");

const evaluationSchema = mongoose.Schema({
  score: Number,
  evaluator: { type: mongoose.Schema.Types.ObjectId, ref: "admins" },
});

const Evaluation = mongoose.model("evaluations", evaluationSchema);

module.exports = Evaluation;
