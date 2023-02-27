var express = require("express");
var router = express.Router();
const Store = require("../models/stores");

//router.get edito for home page

router.get("/edito", (req, res) => {
  Store.findOne({ storeDesc: "gedimat" }).then((data) =>
    res.json({
      result: true,
      title: data.editorialTitle,
      text: editorialText,
      photo: editoPhoto,
    })
  );
});

//router.get edito for selected store
router.get("/edito/:store", (req, res) => {
  Store.findById(req.params.store).then((data) =>
    res.json({
      result: true,
      title: data.editorialTitle,
      text: editorialText,
      photo: editoPhoto,
    })
  );
});
module.exports = router;
