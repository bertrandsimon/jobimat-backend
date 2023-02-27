const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  email: String,
  password: String,
  avatarUrl: String,
  token: String,
  name: String,
  surname: String,
  position: String,
  accessLevel: Number,
  stores: [{ type: mongoose.Schema.Types.ObjectId, ref: "stores" }],
});

const Admin = mongoose.model("admins", adminSchema);

module.exports = Admin;
