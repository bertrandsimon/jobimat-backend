const Admin = require("../models/admins");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Applicant = require("../models/applicants");
const Job = require("../models/jobs");
require("../models/connection");
const Template = require("../models/templates");

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

router.post("/signin", (req, res) => {
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

router.get("/jobs", (req, res) => {
  Job.find()
    .populate("contract")
    .populate("store")
    .populate("jobType")
    .then((data) => res.json({ result: true, allJobs: data }));
});

router.get("/applicants", (req, res) => {
  Applicant.find()
    .populate("evaluation")
    .populate("likedJobs")
    .populate("appliedJobs")
    .populate("resume")
    .then((data) => {
      console.log(data[0].resume);
      res.json({ result: true, allApplicants: data[0] });
    });
});

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

router.get('/templates', (req, res) => {
  Template.find({templateName: req.body.name}).then(data => {
    console.log(data);
    res.json({result: true, template: data})
  })
 });

router.delete("/:delete", (req,res) => {
  Template.deleteOne({
    templateName: req.body.name
  }).then((data) => {
    if (data.deletedCount > 0) {
      console.log(data);
      res.json({ result: true, data: data.reference });
    } else {
      res.json({ result: false, error: "applicant not found" });
    }
  });
});


module.exports = router;
