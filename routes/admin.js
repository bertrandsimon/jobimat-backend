const Admin = require("../models/admins");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Applicant = require("../models/applicants");
const Job = require("../models/jobs");
const Evaluation = require("../models/evaluations");
const Template = require("../models/templates");
const Store = require("../models/stores");
const JobType = require("../models/jobTypes");

//http://localhost:3000/admin/signup
//create new admin
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  Admin.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newAdmin = new Admin({
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });

      newAdmin.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});
//http://localhost:3000/admin/signin
//login for admin
router.post("/signin", (req, res) => {
  //Check if body is empty
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  Admin.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

//http://localhost:3000/admin/jobs
//get all jobs
router.get("/jobs", (req, res) => {
  Job.find()
    .populate("contract")
    .populate("store")
    .populate("jobType")
    .then((data) => res.json({ result: true, allJobs: data }));
});

//http://localhost:3000/admin/applicants
//get all applicants
router.get("/applicants", (req, res) => {
  Applicant.find()
    .populate({
      path: "likedJobs",
      populate: { path: "store", model: Store },
    })
    .populate({
      path: "likedJobs",
      populate: { path: "jobType", model: JobType },
    })
    .populate({
      path: "appliedJobs",
      populate: { path: "store", model: Store },
    })
    .populate({
      path: "appliedJobs",
      populate: { path: "jobType", model: JobType },
    })
    .populate({
      path: "evaluation",
      populate: { path: "evaluator", model: Admin },
    })
    .then((data) => {
      res.json({ result: true, allApplicants: data });
    });
});

//http://localhost:3000/admin/eval
//create evaluation
router.post("/eval", (req, res) => {
  const newEval = new Evaluation({
    score: req.body.score,
    evaluator: req.body.adminId,
  });
  newEval
    .save()
    .then((data) =>
      Applicant.updateOne(
        { _id: req.body.applicantId },
        { evaluation: data._id }
      )
    )
    .then((data) => {
      const isGood = data.modifiedCount > 0;
      res.json({ result: isGood });
    });
});
//http://localhost:3000/admin/templates
//get template with templateName

router.get("/templates", (req, res) => {
  Template.find({ templateName: req.body.name }).then((data) => {
    console.log(data);
    res.json({ result: true, template: data });
  });
});

// router.get("/templates", (req, res) => {
//   templates.findOne({
//     templateName: req.params.templateName,
//   }).then((data) => {
//     if (data) {
//       console.log(data);
//       res.json({ result: true, templates: data });
//     } else {
//       res.json({ result: false, error: "templates advertisement not found" });
//     }
//   });
// });

module.exports = router;
