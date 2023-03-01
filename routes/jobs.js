var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Job = require("../models/jobs");
const Applicant = require("../models/applicants");
const Contract = require("../models/contracts");
const JobType = require("../models/jobTypes");
const Store = require("../models/stores");
//http://localhost:3000/jobs/
// creat a new job advertisement
router.post("/", (req, res) => {
  console.log(req.body);
  if (!checkBody(req.body, ["title"])) {
    res.json({ result: false, error: "Missing or empty field" });
    return;
  }
  // check if advertisement job is already registred
  Job.findOne({ reference: req.body.reference }).then((data) => {
    if (data === null) {
      // job not yet registred => creat new job advertisement
      const newJob = new Job({
        title: req.body.title,
        date: new Date(),
        reference: req.body.reference,
        description: req.body.description,
        contract: req.body.contract,
        store: req.body.store,
        jobType: req.body.job_type,
        isTopOffer: req.body.isTopOffer,
        isValidated: req.body.isValidated,
        candidateFound: req.body.candidateFound,
        isDisplayed: req.body.isDisplayed,
        jobImage: req.body.jobImage,
      });
      // save the new  job advertisement
      newJob.save().then(() => {
        res.json({ result: true, newjob: newJob });
      });
    } else {
      // job advertisement is already registered
      res.json({ result: false, error: "job advertisement  already exists" });
    }
  });
});
//http://localhost:3000/jobs/
// router get search all
router.get("/", (req, res) => {
  Job.find()
    .populate("contract")
    .populate("store")
    .populate("jobType")
    .then((data) => {
      console.log("data", data);
      const isTopOffer = data.filter(
        (e) => e.isTopOffer === true && e.isValidated === true
      );
      const isNotTop = data.filter(
        (e) => e.isTopOffer === false && e.isValidated === true
      );

      if (data) {
        res.json({ result: true, allJobs: isNotTop, topOffers: isTopOffer });
      } else {
        res.json({ result: false, error: "job advertisement not found" });
      }
    });
});
//http://localhost:3000/jobs/id/:id
// router get search  by Id
router.get("/id/:id", (req, res) => {
  Job.findOne({
    _id: req.params.id,
  }).then((data) => {
    if (data) {
      console.log(data);
      res.json({ result: true, job: data });
    } else {
      res.json({ result: false, error: "job advertisement not found" });
    }
  });
});

//http://localhost:3000/jobs/:postalCode
//search by postalCode
router.get("/:postalCode", (req, res) => {
  Job.find()
    .populate("contract")
    .populate("store")
    .populate("jobType")
    .then((data) => {
      const postal = data.filter(
        (e) =>
          e.store.postalCode === req.params.postalCode && e.isValidated === true
      );
      if (data) {
        console.log(data);
        res.json({ result: true, storeSelected: postal });
      } else {
        res.json({ result: false, error: "job advertisement not found" });
      }
    });
});

// router.put("/:reference", (req, res) => {
//     Job.findOne({
//       reference: req.body.reference,
//     }).then((data) => {
//       if (data) { console.log(data);
//         Job.updateOne(

//         )
//         res.json({ result: true, reference: data.reference });
//       } else {
//         res.json({ result: false, error: "job not found" });
//       }
//     });
//   });

//http://localhost:3000/jobs/
//delete jobs with id
router.delete("/:delete", (req, res) => {
  Job.deleteOne({
    _id: req.params.delete,
  }).then((data) => {
    if (data.deletedCount > 0) {
      console.log(data);
      res.json({ result: true, data: data.reference });
    } else {
      res.json({ result: false, error: "job not found" });
    }
  });
});
//http://localhost:3000/jobs/type
//create new jobType
router.post("/type", (req, res) => {
  const newJobType = new JobType({
    typeName: req.body.type,
  });
  newJobType.save();
});
//http://localhost:3000/jobs/liked
//add a new liked job to applicant
router.post("/liked", (req, res) => {
  console.log(req.body);
  Applicant.updateOne(
    { token: req.body.token },
    { $push: { likedJobs: req.body.idJob } }
  ).then((data) => {
    const isGood = data.modifiedCount > 0;
    console.log(data);
    res.json({ result: isGood });
  });
});
//http://localhost:3000/jobs/applied
//add a new applied job to applicant
router.post("/applied", (req, res) => {
  Applicant.updateOne(
    { token: req.body.token },
    { $push: { appliedJobs: req.body.idJob } }
  ).then((data) => {
    const isGood = data.modifiedCount > 0;
    res.json({ result: isGood });
  });
});

module.exports = router;
