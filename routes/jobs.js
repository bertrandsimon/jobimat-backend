var express = require('express');
var router = express.Router();
const {checkBody}=require ('../modules/checkBody');
const Job= require ('../models/jobs');

// creation job advertisement
router.post('/', (req, res)=> { console.log(req.body);
    if ( !checkBody(req.body,["title"])){
        res.json({result: false, error:"Missing or empty field"});
        return;
    }
    // check if job is already registred
    Job.findOne({reference:req.body.reference})
    .then (data => {
        if (data === null){
  // jobis not yet registred => creat new job advertisement
  const newJob = new Job({
      title : req.body.title,
      date: new Date,
      reference : req.body.reference,
  });
  // save the new user
      newJob.save().then(() =>{
          res.json({result: true});
      } );
      } else {
  // user is already registered
          res.json ({result: false, error: "job advertisement  already exists"})
      }
    });
  });

  
  

module.exports = router;