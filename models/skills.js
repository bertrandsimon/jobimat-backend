const mongoose = require("mongoose");

const skillSchema = mongoose.Schema({
  name: String,
  url: String,
  desc: String,
});

const Skill = mongoose.model("skills", skillSchema);

module.exports = Skill;
