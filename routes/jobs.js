var express = require('express');
var router = express.Router();
const {checkBody}=require ('../modules/checkBody');
const jobs= require ('../models/jobs');

// creation jobs
router.post('/', (req, res)=> {
    if ( !checkBody(req.body,["username","password"])){
        res.json({result: false, error:"Missing or empty field"});
        return;
    }
    // check if user is already registred
    User.findOne({username:req.body.username})
    .then (data => {
        if (data === null){
  // user is not yet registred => creat new user par rapport au UserSchema
  const newUser = new User({
      username : req.body.username,
      password : req.body.password,
  });
  // save the new user
      newUser.save().then(() =>{
          res.json({result: true});
      } );
      } else {
  // user is already registered
          res.json ({result: false, error: "user already exists"})
      }
    });
  });
  

  res.send('respond with a resource');
});

module.exports = router;