var express = require("express");
var router = express.Router();
const Store = require("../models/stores");
const Skill = require("../models/skills");
const Evaluation = require("../models/evaluations");
const Applicant = require("../models/applicants");
const Admin = require("../models/admins");
const Template = require("../models/templates");

//http://localhost:3000/edito
//router.get edito for home page
router.get("/edito", (req, res) => {
  Store.findOne({ storeName: "gedex" }).then((data) =>
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

module.exports = router;
