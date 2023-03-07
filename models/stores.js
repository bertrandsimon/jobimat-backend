const mongoose = require("mongoose");

const storeSchema = mongoose.Schema({
  city: String,
  address: String,
  postalCode: String,
  phoneContact: String,
  photoUrl: String,
  desc: String,
  email: String,
  bossName: String,
  storeTypes: Array,
  editorialTitle: String,
  editorialText: String,
  editorialPhoto: String,
  storeName: String,
  adherent: String,
});

const Store = mongoose.model("stores", storeSchema);

module.exports = Store;
