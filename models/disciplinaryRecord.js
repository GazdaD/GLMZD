const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const disciplinaryRecordSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  issuedBy: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DisciplinaryRecord", disciplinaryRecordSchema);
