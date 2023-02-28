var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Job = require("../models/jobs");
const Applicant = require("../models/applicants");

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
        // description: req.body.description,
        // contract: req.body.contract,
        // store:req.body.store,
        // job_type: req.body.job_type,
        is_top_offer: false,
        is_validated: false,
        candidate_found: false,
        is_displayed: false,
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

// router get search all
router.get("/", (req, res) => {
  Job.find().then((data) => {
    if (data) {
      console.log(data);
      res.json({ result: true, job: data });
    } else {
      res.json({ result: false, error: "job advertisement not found" });
    }
  });
});

// router get search  by Id
router.get("/:id", (req, res) => {
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

// router get search  by top_offer
router.get("/top_offer", (req, res) => {
  Job.find({
    is_top_offer: true,
    is_valited:true,
  }).then((data) => {
    if (data) {
      console.log(data);
      res.json({ result: true, jobs: data });
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

router.post
("/liked", (req, res) => {
  console.log(req.body);
  Applicant.updateOne(
    { token: req.body.token },
    { $push: { likedJobs: req.body.idJob } }
  ).then((data) => {
const isGood = data.modifiedCount > 0;
console.log(data);
    res.json({ result: isGood }
      )});
}); 

module.exports = router;
