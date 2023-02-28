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

//create skill
router.post("/skill", (req, res) => {
  const newSkill = new Skill({
    name: req.body.name,
  });
  newSkill.save().then((data) => res.json({ result: true }));
});

//create template
router.post("/template", (req, res) => {
  const newTemplate = new Template({
    templateName: req.body.name,
    globalDesc: req.body.desc,
  });
  newTemplate.save();
});

module.exports = router;
