var express = require("express");
var router = express.Router();
const Job = require("../models/jobs");
const Applicant = require("../models/applicants");
const Contract = require("../models/contracts");
const JobType = require("../models/jobTypes");
const Store = require("../models/stores");
const Admin = require("../models/admins");
const Evaluation = require("../models/evaluations");
const Template = require("../models/templates");

router.get("/", async (req, res) => {
  const numbOfApplicants = await Applicant.find().then((data) => data.length);
  const numbOfJobs = await Job.find().then((data) => data.length);
  const numbOfStore = await Store.find().then((data) => data.length);
  const numbOfTemplates = await Template.find().then((data) => data.length);
  const numbOfValidatedJobs = await Job.find({ isValidated: true }).then(
    (data) => data.length
  );
  const numbOfTopOffer = await Job.find({ isTopOffer: true }).then(
    (data) => data.length
  );
  const numbOfCandidateFound = await Job.find({ candidateFound: true }).then(
    (data) => data.length
  );
  const jobPublished30 = await Job.find().then((data) => {
    return data.filter((el) => {
      const date = new Date();
      const diffInDays = Math.ceil(
        Math.abs(date - el.date) / (1000 * 60 * 60 * 24)
      );
      if (diffInDays > 30) {
        return el;
      }
    }).length;
  });
  const appliedJobs = await Applicant.find()
    .populate("appliedJobs")
    .then((data) => {
      let total = 0;
      data.filter((el) => (total += el.appliedJobs.length));
      return total;
    });
  const likedJobs = await Applicant.find()
    .populate("likedJobs")
    .then((data) => {
      let total = 0;
      data.filter((el) => (total += el.likedJobs.length));
      return total;
    });
  const percentOfAppliedJob = (appliedJobs / numbOfJobs) * 100;
  const types = await JobType.find().then((data) => data);
  const jobs = await Job.find()
    .populate("contract")
    .populate("store")
    .populate("jobType")
    .then((data) => data);

  const sortedJobsByType = {};
  types.forEach((type) => {
    sortedJobsByType[type.typeName] = jobs.filter(
      (job) => job.jobType.typeName === type.typeName
    ).length;
  });
  const allStores = await Store.find().then((data) => data);

  const sortedJobsByStore = {};
  allStores.forEach((eachStore) => {
    sortedJobsByStore[eachStore.storeName] = jobs.filter(
      // (job) => job.store.storeName === eachStore.storeName
      //attention compare id avec equals
      (job) => job.store._id.equals(eachStore._id)
    ).length;
  });

  res.json({
    result: true,
    numbOfApplicants,
    numbOfJobs,
    numbOfStore,
    numbOfTemplates,
    numbOfValidatedJobs,
    numbOfTopOffer,
    numbOfCandidateFound,
    jobPublished30,
    appliedJobs,
    likedJobs,
    percentOfAppliedJob,
    sortedJobsByType,
    sortedJobsByStore,
  });
});

module.exports = router;
