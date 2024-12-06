const express = require("express");
const router = express.Router();
const Platoon = require("../models/platoon");
const Company = require("../models/company");

router.post("/:companyId", async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(404).json({ message: "Рота не знайдена" });
    }

    const platoon = new Platoon(req.body);
    await platoon.save();

    company.platoons.push(platoon._id);
    await company.save();

    res.status(201).send(platoon);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const platoons = await Platoon.find()
      .populate("platoonCommander")
      .populate("squads");
    res.send(platoons);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const platoon = await Platoon.findById(req.params.id)
      .populate("platoonCommander")
      .populate("squads");
    if (!platoon) {
      return res.status(404).send("Platoon not found");
    }
    res.send(platoon);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const platoon = await Platoon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!platoon) {
      return res.status(404).send("Platoon not found");
    }
    res.send(platoon);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const platoon = await Platoon.findByIdAndDelete(req.params.id);
    if (!platoon) {
      return res.status(404).send("Platoon not found");
    }
    res.send(platoon);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
