var express = require("express");
var router = express.Router();
const Store = require("../models/stores");

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
module.exports = router;
