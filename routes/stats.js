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
//http://localhost:3000/stats
//all stats, but to fat for Edouard's PC
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
    allStores.forEach((eachStore) => {
      sortedJobsByStore[eachStore.adherent] = jobs.filter(
        (job) => job.store.adherent === eachStore.adherent
      ).length;
    });
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
// nb de total offre / semaine, /mois, /années
//mm pourvus
//offre créées

//http://localhost:3000/stats/job/stats
//stats per years
router.get("/job/stat", async (req, res) => {
  //all offers
  const all = await Job.find().then((data) => {
    return data;
  });
  const arrYears = { all: {}, top: {}, applied: {} };
  all.forEach((obj) => {
    const key = new Date(obj.date).getFullYear();
    arrYears.all[key] = all.filter((el) => {
      const newDate = new Date(el.date).getFullYear();
      return el.candidateFound === false && newDate === key;
    }).length;
    arrYears.top[key] = all.filter((el) => {
      const newDate = new Date(el.date).getFullYear();
      return (
        newDate === key && el.isTopOffer === true && el.candidateFound === false
      );
    }).length;
    arrYears.applied[key] = all.filter((el) => {
      const newDate = new Date(el.date).getFullYear();
      return newDate === key && el.candidateFound === true;
    }).length;
  });
  const arrMonths = { all: {}, top: {}, applied: {} };
  all.forEach((obj) => {
    const key = `${new Date(obj.date).getMonth() + 1}-${new Date(
      obj.date
    ).getFullYear()}`;
    arrMonths.all[key] = all.filter((el) => {
      const newDate = `${new Date(el.date).getMonth() + 1}-${new Date(
        el.date
      ).getFullYear()}`;
      return (
        (el.candidateFound === false && newDate === key) ||
        (new Date(obj.date).getMonth() - 1 > new Date(el.date).getMonth() - 1 &&
          new Date(obj.date).getFullYear() > new Date(el.date).getFullYear())
      );
    }).length;
    arrMonths.top[key] = all.filter((el) => {
      const newDate = `${new Date(el.date).getMonth() + 1}-${new Date(
        el.date
      ).getFullYear()}`;
      return newDate === key && el.isTopOffer === true;
    }).length;
    arrMonths.applied[key] = all.filter((el) => {
      const newDate = `${new Date(el.date).getMonth() + 1}-${new Date(
        el.date
      ).getFullYear()}`;
      return newDate === key && el.candidateFound === true;
    }).length;
  });
  // const arrWeeks = { all: {}, top: {}, applied: {} };
  // all.forEach((obj) => {
  //   const date = new Date(obj.date);
  //   const year = new Date(date.getFullYear(), 0, 1);
  //   const days = Math.floor((date - year) / (24 * 60 * 60 * 1000));
  //   const week = Math.ceil((date.getDay() + 1 + days) / 7) - 1;
  //   const key = `S${week}-${new Date(obj.date).getFullYear()}`;
  //   arrWeeks.all[key] = all.filter((el) => {
  //     const newDate = `S${week}-${new Date(el.date).getFullYear()}`;
  //     return newDate === key || ;
  //   }).length;
  //   arrWeeks.top[key] = all.filter((el) => {
  //     const newDate = `S${week}-${new Date(el.date).getFullYear()}`;
  //     return newDate === key && el.isTopOffer === true;
  //   }).length;
  //   arrWeeks.applied[key] = all.filter((el) => {
  //     const newDate = `S${week}-${new Date(el.date).getFullYear()}`;
  //     return newDate === key && el.candidateFound === true;
  //   }).length;
  // });
  res.json({
    result: true,
    allOffersByYear: arrYears,
    allOffersByMonth: arrMonths,
    // allOffersByWeek: arrWeeks,
  });
});

router.get("/job/stat", async (req, res) => {
  //all offers
  const all = await Job.find().then((data) => {
    return data;
  });
  const arrYears = { all: {}, top: {}, applied: {} };
  all.forEach((obj) => {
    const key = new Date(obj.date).getFullYear();
    arrYears.all[key] = all.filter((el) => {
      const newDate = new Date(el.date).getFullYear();
      return newDate === key;
    }).length;
    arrYears.top[key] = all.filter((el) => {
      const newDate = new Date(el.date).getFullYear();
      return (
        newDate === key && el.isTopOffer === true && el.candidateFound === false
      );
    }).length;
    arrYears.applied[key] = all.filter((el) => {
      const newDate = new Date(el.date).getFullYear();
      return newDate === key && el.candidateFound === true;
    }).length;
  });
  const arrMonths = { all: {}, top: {}, applied: {} };
  all.forEach((obj) => {
    const key = `${new Date(obj.date).getMonth() + 1}-${new Date(
      obj.date
    ).getFullYear()}`;
    arrMonths.all[key] = all.filter((el) => {
      const newDate = `${new Date(el.date).getMonth() + 1}-${new Date(
        el.date
      ).getFullYear()}`;
      return (
        (el.candidateFound === false && newDate === key) ||
        (new Date(obj.date).getMonth() - 1 > new Date(el.date).getMonth() - 1 &&
          new Date(obj.date).getFullYear() > new Date(el.date).getFullYear())
      );
    }).length;
    arrMonths.top[key] = all.filter((el) => {
      const newDate = `${new Date(el.date).getMonth() + 1}-${new Date(
        el.date
      ).getFullYear()}`;
      return newDate === key && el.isTopOffer === true;
    }).length;
    arrMonths.applied[key] = all.filter((el) => {
      const newDate = `${new Date(el.date).getMonth() + 1}-${new Date(
        el.date
      ).getFullYear()}`;
      return newDate === key && el.candidateFound === true;
    }).length;
  });
  // const arrWeeks = { all: {}, top: {}, applied: {} };
  // all.forEach((obj) => {
  //   const date = new Date(obj.date);
  //   const year = new Date(date.getFullYear(), 0, 1);
  //   const days = Math.floor((date - year) / (24 * 60 * 60 * 1000));
  //   const week = Math.ceil((date.getDay() + 1 + days) / 7) - 1;
  //   const key = `S${week}-${new Date(obj.date).getFullYear()}`;
  //   arrWeeks.all[key] = all.filter((el) => {
  //     const newDate = `S${week}-${new Date(el.date).getFullYear()}`;
  //     return newDate === key || ;
  //   }).length;
  //   arrWeeks.top[key] = all.filter((el) => {
  //     const newDate = `S${week}-${new Date(el.date).getFullYear()}`;
  //     return newDate === key && el.isTopOffer === true;
  //   }).length;
  //   arrWeeks.applied[key] = all.filter((el) => {
  //     const newDate = `S${week}-${new Date(el.date).getFullYear()}`;
  //     return newDate === key && el.candidateFound === true;
  //   }).length;
  // });
  res.json({
    result: true,
    allOffersByYear: arrYears,
    allOffersByMonth: arrMonths,
    // allOffersByWeek: arrWeeks,
  });
});

//router test for charts
// router.get("/test", async (req, res) => {
//   const all = await Job.find().then((data) => data);
//   let byYear = {};
//   all.forEach((element) => {
//     const date = new Date(element.date).getFullYear();

//     return (byYear[date] = all.filter(
//       (job) => new Date(job.date).getFullYear() === date
//     ).length);
//   });
//   res.json({ result: true, test: byYear });
// });


//  for Chart's job by type
router.get("/jobsByType", async (req, res) => {
  const types = await JobType.find().then((data) => data);
  const jobs = await Job.find()
    .populate("jobType")
    .then((data) => data);

  const sortedJobsByType = {};
  types.forEach((type) => {
    sortedJobsByType[type.typeName] = jobs.filter(
      (job) => job.jobType.typeName === type.typeName
    ).length;
  });
  res.json({ result: true, jobsByType: sortedJobsByType });
});


//  for Chart's job by branch
router.get("/jobsByBranch", async (req, res) => {
  const job = await Job.find()
    .populate("store")
    .then((data) => data);

  const allStores = await Store.find().then((data) => data);

  const sortedJobsByBranch = {};
  allStores.forEach((eachStore) => {
    sortedJobsByBranch[eachStore.adherent] = job.filter(
      (key) => key.store.adherent === eachStore.adherent
    ).length;
  });
  
  const formattedSortedJobsByBranch = {};
  Object.keys(sortedJobsByBranch)
    .sort((a, b) => sortedJobsByBranch[a] - sortedJobsByBranch[b])
    .forEach((key) => {
      formattedSortedJobsByBranch[key] = sortedJobsByBranch[key];
    });
  
const sortedValues = Object.values(formattedSortedJobsByBranch).sort((a, b) => b - a);
const sortedBranch = {};

sortedValues.forEach((value) => {
  const key = Object.keys(formattedSortedJobsByBranch).find((key) => formattedSortedJobsByBranch[key] === value);
  sortedBranch[key] = value;
});
res.json({ result: true, adherent: sortedBranch });
});

module.exports = router;
