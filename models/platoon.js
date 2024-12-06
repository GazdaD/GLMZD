const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const platoonSchema = new Schema({
  platoonNumber: {
    type: String,
    required: true,
  },
  platoonCommander: {
    type: Schema.Types.ObjectId,
    ref: "Soldier",
  },
  squads: [
    {
      type: Schema.Types.ObjectId,
      ref: "Squad",
    },
  ],
  totalPersonnel: {
    type: Number,
    default: 0,
  },
});

platoonSchema.pre("save", async function (next) {
  const Platoon = this;
  const squads = await mongoose
    .model("Squad")
    .find({ _id: { $in: Platoon.squads } });
  let total = 0;
  squads.forEach((squad) => {
    total += squad.totalPersonnel;
  });
  Platoon.totalPersonnel = total;
  next();
});

module.exports = mongoose.model("Platoon", platoonSchema);
