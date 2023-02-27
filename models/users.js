
const mongoose = require("mongoose");

const resumeSchema = mongoose.Schema({
  profileDesc: String,
  educations: Array,
  experiences: Array,
  hobbies: Array,
  email: String,
  phone: String,
  address: String,
  linkedin: String,
  lineup: String,
  birthDate: String,
  englishLevel: Number,
  spanishLevel: Number,
  germanLevel: Number,
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "skills" }],
});

const applicantSchema = mongoose.Schema({
  email: String,
  password: String,
  photoUrl: String,
  token: String,
  name: String,
  surname: String,
  resumeUrl: String,
  likedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "jobs" }],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "jobs" }],
  evaluation: { type: mongoose.Schema.Types.ObjectId, ref: "evaluations" },
  resume: resumeSchema,
});

const Applicant = mongoose.model("applicants", applicantSchema);

module.exports = Applicant;