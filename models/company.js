const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema({
  companyNumber: {
    type: String,
    required: true,
  },
  commanders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Soldier",
    },
  ],
  platoons: [
    {
      type: Schema.Types.ObjectId,
      ref: "Platoon",
    },
  ],
  totalPersonnel: {
    type: Number,
    default: 0,
  },
});

companySchema.pre("save", async function (next) {
  const Company = this;
  const platoons = await mongoose
    .model("Platoon")
    .find({ _id: { $in: Company.platoons } });
  let total = 0;
  platoons.forEach((platoon) => {
    total += platoon.totalPersonnel;
  });
  Company.totalPersonnel = total;
  next();
});

module.exports = mongoose.model("Company", companySchema);
