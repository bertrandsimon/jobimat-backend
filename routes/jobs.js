var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Job = require("../models/jobs");

// creation job advertisement
router.post("/", (req, res) => {
  console.log(req.body);
  if (!checkBody(req.body, ["title"])) {
    res.json({ result: false, error: "Missing or empty field" });
    return;
  }
  // check if job is already registred
  Job.findOne({ reference: req.body.reference }).then((data) => {
    if (data === null) {
      // jobis not yet registred => creat new job advertisement
      const newJob = new Job({
        title: req.body.title,
        date: new Date(),
        reference: req.body.reference,
      });
      // save the new user
      newJob.save().then(() => {
        res.json({ result: true });
      });
    } else {
      // user is already registered
      res.json({ result: false, error: "job advertisement  already exists" });
    }
  });
});

router.get("/:reference", (req, res) => {
  Job.findOne({
    reference: req.params.reference,
  }).then((data) => {
    if (data) { console.log(data);
      res.json({ result: true, reference: data.reference });
    } else {
      res.json({ result: false, error: "job not found" });
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
      if (data.deletedCount>0) {
        console.log(data);
        res.json({ result: true, data: data });
      } else {
        res.json({ result: false, error: "job not found" });
      }
    });
  });
  


module.exports = router;
