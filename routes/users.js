var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const Applicant = require("../models/applicants");

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
