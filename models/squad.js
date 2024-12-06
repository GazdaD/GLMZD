const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const squadSchema = new Schema({
  squadNumber: {
    type: String,
    required: true,
  },
  squadCommander: {
    type: Schema.Types.ObjectId,
    ref: "Soldier",
  },
  soldiers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Soldier",
    },
  ],
  totalPersonnel: {
    type: Number,
    default: 0,
  },
});

squadSchema.pre("save", async function (next) {
  const Squad = this;
  Squad.totalPersonnel = Squad.soldiers.length + 1; 
  next();
});

module.exports = mongoose.model("Squad", squadSchema);
