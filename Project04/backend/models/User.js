const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  department: String,
});

const User = mongoose.model("User", schema);

module.exports = User;