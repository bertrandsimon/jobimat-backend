var express = require("express");
var router = express.Router();
require("../models/connection");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const Applicant = require("../models/users");

router.post("/signup", (req, res) => {
  console.log(req.body);
  if (!checkBody(req.body, ["surname", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  Applicant.findOne({ surname: req.body.surname }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newApplicant = new Applicant({
        surname: req.body.surname,
        password: hash,
        token: uid2(32),
      });

      newApplicant.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

//Router.POST for login
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ result: false, error: "something is missing" });
  }
  Applicant.findOne({ username: req.body.username }).then((data) => {
    if (!data) {
      return res.json({ result: false, error: "user doesn't exist" });
    }
    if (bcrypt.compareSync(req.body.password, data.password)) {
      return res.json({ result: true, message: "welcome back" });
    } else {
      return res.json({ result: false, error: "wrong password" });
    }
  });
});

module.exports = router;
