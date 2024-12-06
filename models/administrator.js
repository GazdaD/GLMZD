const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const administratorSchema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  soldierID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Soldier",
    required: true,
  },
  companyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Administrator", administratorSchema);
