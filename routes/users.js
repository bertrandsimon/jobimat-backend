var express = require("express");
var router = express.Router();
require("../models/connection");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const Applicant = require("../models/applicants");
const uniqid = require("uniqid");
const fs = require("fs");

//http://localhost:3000/users/signup
//Create a new user
router.post("/signup", (req, res) => {
  console.log(req.body);
  if (!checkBody(req.body, ["email", "password", "name", "surname"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered

  Applicant.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newApplicant = new Applicant({
        email: req.body.email,
        password: hash,
        name: req.body.name,
        surname: req.body.surname,
        token: uid2(32),
      });
      //save new doc in db
      newApplicant.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

//http://localhost:3000/users/signin
//login user
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ result: false, error: "something is missing" });
  }
  //search if someone already use this email
  Applicant.findOne({ email }).then((data) => {
    console.log(data);
    if (!data) {
      return res.json({ result: false, error: "user doesn't exist" });
    }
    if (bcrypt.compareSync(password, data.password)) {
      return res.json({
        result: true,
        token: data.token,
        name: data.name,
        surname: data.surname,
      });
    } else {
      return res.json({ result: false, error: "wrong password" });
    }
  });
});
//http://localhost:3000/users/upload/:token
//Save a new doc in backend
router.post("/upload/:token", async (req, res) => {
  const docPath = `./doc/${uniqid()}.pdf`;
  const resultMove = await req.files.docFromFront.mv(docPath);
  if (!resultMove) {
    Applicant.updateOne(
      { token: req.params.token },
      { resumeUrl: docPath }
    ).then((data) => res.json({ result: true, message: "save ok " }));
  } else {
    res.json({ result: false, error: resultCopy });
  }
});
//http://localhost:3000/users/profile
//add name & surname in applicant's profile
// router.post("/profile", (req, res) => {
//   Applicant.updateOne(
//     { token: req.body.token },
//     { name: req.body.name, surname: req.body.surname }
//   ).then((data) => {
//     console.log(data);
//     res.json({ result: data.acknowledged });
//   });
// });
//http://localhost:3000/users/skills
//add skills in applicant's profile
router.post("/skills", (req, res) => {
  Applicant.updateOne(
    { token: req.body.token },
    { resume: { $push: { skills: req.body.skill } } }
  ).then((data) => {
    console.log(data);
    const isGood = data.modifiedCount > 0;
    res.json({ result: isGood });
  });
});
//http://localhost:3000/:delete
//delete a doc in db
router.delete("/:delete", (req, res) => {
  Applicant.deleteOne({
    token: req.body.token,
  }).then((data) => {
    if (data.deletedCount > 0) {
      console.log(data);
      res.json({ result: true, data: data.reference });
    } else {
      res.json({ result: false, error: "applicant not found" });
    }
  });
});

//http://localhost:3000/password
//user can

module.exports = router;
