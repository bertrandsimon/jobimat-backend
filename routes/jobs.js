var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkbody");
const Job = require("../models/jobs");
const Applicant = require("../models/applicants");
const Contract = require("../models/contracts");
const JobType = require("../models/jobTypes");
const Store = require("../models/stores");

//http://localhost:3000/jobs/
// creat a new job advertisement
router.post("/", (req, res) => {
  if (!checkBody(req.body, ["title"])) {
    res.json({ result: false, error: "Missing or empty field" });
    return;
  }

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
});

// router get search all, by validated or not, by top Offers or not
//http://localhost:3000/jobs/
// router get search all
router.get("/", (req, res) => {
  Job.find()
    .populate("contract")
    .populate("store")
    .populate("jobType")
    .then((data) => {
      const isTopOffer = data.filter(
        (e) => e.isTopOffer === true && e.isValidated === true
      );
      const isNotTop = data.filter(
        (e) => e.isTopOffer === false && e.isValidated === true
      );
      const isNotValidated = data.filter((e) => e.isValidated === false);
      const offerValidated = data.filter((e) => e.isValidated === true);

      if (data) {
        res.json({
          result: true,
          allOffers: data,
          topOffers: isTopOffer,
          allJobs: isNotTop,
          offersValidated: offerValidated,
          offersNotValidated: isNotValidated,
        });
      } else {
        res.json({ result: false, error: "job advertisement not found" });
      }
    });
});

//http://localhost:3000/jobs/code/:postalCode
//search by postal code (offer validated only)
router.get("/code/:postalCode", (req, res) => {
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

//http://localhost:3000/jobs/type/:jobtype
// search by jobTag (offer validated only)
router.get("/type/:jobtype", (req, res) => {
  Job.find()
    .populate("contract")
    .populate("store")
    .populate("jobType")
    .then((data) => {
      let typeOfJob = data.filter(
        (e) => e.jobType.typeName === req.params.jobtype
      );
      if (data) {
        res.json({ result: true, Jobtag: typeOfJob });
      } else {
        res.json({ result: false, error: "job advertisement not found" });
      }
    });
});
//http://localhost:3000/jobs/id/:id
// search offer by Id
router.get("/id/:id", (req, res) => {
  console.log(typeof req.params.id);
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

//http://localhost:3000/jobs/delete/:delete
//delete jobs with id
router.delete("/delete/:delete", (req, res) => {
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

//http://localhost:3000/jobs/allTypes
//get all types
router.get("/allTypes", (req, res) => {
  JobType.find().then((data) => {
    res.json({ result: true, all: data });
  });
});

//http://localhost:3000/jobs/byTypes
//sort jobs by types

router.get("/byTypes", async (req, res) => {
  const types = await JobType.find().then((data) => data);
  const jobs = await Job.find()
    .populate("contract")
    .populate("store")
    .populate("jobType")
    .then((data) => data);

  const sortedJobs = [];
  types.forEach((type) => {
    sortedJobs.push({
      key: type.typeName,
      nb: jobs.filter((job) => job.jobType.typeName === type.typeName).length,
      data: jobs.filter((job) => job.jobType.typeName === type.typeName),
    });
  });
  res.json({ result: true, jobsByType: sortedJobs });
});

//http://localhost:3000/jobs/update/:key
//Change value for one key in one job
router.post("/update/:key", (req, res) => {
  Job.findOne({ _id: req.body.id }).then((data) => {
    const newValue = data[req.params.key];
    Job.updateOne({ _id: data._id }, { [req.params.key]: !newValue }).then(
      (data) => res.json({ result: data.modifiedCount > 0 })
    );
  });
});

//http://localhost:3000/jobs/inputData
//all data for input autocomplete
router.get("/inputData", async (req, res) => {
  let jobName = await Job.find().then((data) => data.map((el) => el.title));
  jobName = jobName.filter((el, i) => jobName.indexOf(el) === i);
  let storeData = await Store.find().then((data) =>
    data.map((el) => {
      return `${el.postalCode} ${el.storeName}`;
      // return  postalCode: el.postalCode, storeName: el.storeName ;
    })
  );

  res.json({ result: true, postes: jobName, stores: storeData });
});

//http://localhost:3000/jobs/deleteLiked
//delete one job liked
router.delete("/deleteLiked", (req, res) => {
  Applicant.updateOne(
    { token: req.body.token },
    { $pull: { likedJobs: req.body.idJob } }
  ).then((data) => {
    console.log(data);
    res.json({ result: data.modifiedCount > 0 });
  });
});
//localhost:3000/jobs/deleteApplied
//delete one job applied
http: router.delete("/deleteApplied", (req, res) => {
  Applicant.updateOne(
    { token: req.body.token },
    { $pull: { likedJobs: req.body.idJob } }
  ).then((data) => res.json({ result: data.modifiedCount > 0 }));
});

module.exports = router;
