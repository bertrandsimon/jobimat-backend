var express = require("express");
var router = express.Router();
const Store = require("../models/stores");
const Skill = require("../models/skills");
const Evaluation = require("../models/evaluations");
const Applicant = require("../models/applicants");
const Admin = require("../models/admins");
const Template = require("../models/templates");
const JobType = require("../models/jobTypes");
const Contract = require("../models/contracts");
const Job = require("../models/jobs");

//http://localhost:3000/edito
//router.get edito for home page
router.get("/edito", (req, res) => {
  Store.findOne({ storeName: "Gedex" }).then((data) =>
    res.json({
      result: true,
      title: data.editorialTitle,
      text: data.editorialText,
      photo: data.editoPhoto,
    })
  );
});
//http://localhost:3000/edito/:store
//router.get edito for selected store
router.get("/edito/:store", (req, res) => {
  Store.findById(req.params.store).then((data) =>
    res.json({
      result: true,
      title: data.editorialTitle,
      text: data.editorialText,
      photo: data.editoPhoto,
    })
  );
});
//http://localhost:3000/skill
//create skill
router.post("/skill", (req, res) => {
  const newSkill = new Skill({
    name: req.body.name,
  });
  newSkill.save().then((data) => res.json({ result: true }));
});
//http://localhost:3000/template
//create new template
router.post("/template", (req, res) => {
  const newTemplate = new Template({
    templateName: req.body.name,
    globalDesc: req.body.desc,
  });
  newTemplate.save();
});

//create store for test
router.post("/store", (req, res) => {
  const newStore = new Store({
    city: "Nice",
  });
  newStore.save().then(() => res.json({ result: true }));
});

//add edito

router.post("/storeEdito", async (req, res) => {
  const stores = await Store.find().then((data) => data);
  stores.forEach((store) => {
    const title = `Bienvenue dans le magasin de ${store.storeName.substring(
      store.storeName.indexOf("-") + 2
    )}`;
    const text =
      "Venez découvrir nos dernières nouveautés dans votre magasin préféré.";
    const img =
      "https://www.gedimatlabenne.fr/wp-content/uploads/2022/03/gedimat-qui-sommes-nous.jpg";
    Store.updateOne(
      { storeName: store.storeName },
      {
        editorialTitle: title,
        editorialText: text,
        editorialPhoto: img,
      }
    ).then((data) => console.log(data));
  });
  res.json({ result: true });
});

router.get("/createjobs", (req, res) => {
  JobType.find().then((data) => {
    const jobTypeArr = data.map((id) => {
      return id._id;
    });
    Contract.find().then((data) => {
      const contractsArr = data.map((id) => {
        return id._id;
      });
      Store.find().then((data) => {
        const storeArr = data.map((id) => {
          return id._id;
        });
        Job.find().then((data) => {
          const titleArr = data.map((data) => {
            return data.title;
          });
          const bool = [
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            false,
            false,
            true,
          ];
          for (let i = 0; i < 1000; i++) {
            const date = Math.floor(
              Math.random() *
                (new Date("2025/12/31").getTime() -
                  new Date("2012/01/01").getTime()) +
                new Date("2012/01/01").getTime()
            );
            const newJob = new Job({
              title:
                titleArr[Math.floor(Math.random() * (titleArr.length - 1))],
              description: "Description à venir",
              contract:
                contractsArr[
                  Math.floor(Math.random() * (contractsArr.length - 1))
                ],
              date: new Date(date),
              reference: "",
              store:
                storeArr[Math.floor(Math.random() * (storeArr.length - 1))],
              jobType:
                jobTypeArr[Math.floor(Math.random() * (jobTypeArr.length - 1))],
              isValidated: bool[Math.floor(Math.random() * (bool.length - 1))],
              isTopOffer: bool[Math.floor(Math.random() * (bool.length - 1))],
              candidateFound:
                bool[Math.floor(Math.random() * (bool.length - 1))],
              isDisplayed: bool[Math.floor(Math.random() * (bool.length - 1))],
              jobImage: "",
            });
            newJob.save();
          }
        });
      });
    });
  });
  res.json({ result: true });
});

router.get("/image", (req, res) => {
  Job.updateMany(
    { description: "Description à venir" },
    {
      jobImage:
        "https://uploads.gedimat.fr/EMPLOI/ed/MET_IMAGE_15_1666280380.jpg",
    }
  ).then((data) => res.json({ result: data.modifiedCount > 0 }));
});

//add skills for each applicant
router.post("/addSkill", (req, res) => {
  Applicant.updateMany(
    {},
    { resume: { $push: { skills: "63fe07afae8b43188fe3eded" } } }
  ).then((data) => {
    console.log(data);
    const isGood = data.modifiedCount > 0;
    res.json({ result: isGood });
  });
});

module.exports = router;
