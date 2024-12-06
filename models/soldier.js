const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const soldierSchema = new Schema({
  rank: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  companyNumber: {
    type: String,
    required: true,
  },
  platoonNumber: {
    type: String,
    required: true,
  },
  squadNumber: {
    type: String,
    required: true,
  },
  disciplinaryRecords: [
    {
      type: Schema.Types.ObjectId, 
      ref: "DisciplinaryRecord",
    },
  ],
});

module.exports = mongoose.model("Soldier", soldierSchema);
