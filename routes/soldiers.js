const express = require("express");
const router = express.Router();
const Soldier = require("../models/soldier");
const Squad = require("../models/squad");
const Platoon = require("../models/platoon");
const Company = require("../models/company");

router.post("/", async (req, res) => {
  try {
    const soldier = new Soldier(req.body);
    await soldier.save();

    res.status(201).send(soldier);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const soldiers = await Soldier.find().populate("disciplinaryRecords");
    res.send(soldiers);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const soldier = await Soldier.findById(req.params.id).populate(
      "disciplinaryRecords"
    );
    if (!soldier) {
      return res.status(404).send("Soldier not found");
    }
    res.send(soldier);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const soldier = await Soldier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!soldier) {
      return res.status(404).send("Soldier not found");
    }
    res.send(soldier);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const soldier = await Soldier.findByIdAndDelete(req.params.id);
    if (!soldier) {
      return res.status(404).send("Soldier not found");
    }

    if (req.body) {
      const { squadId } = req.body;
      const squad = await Squad.findById(squadId);
      if (squad) {
        const index = squad.soldiers.indexOf(soldier._id);
        if (index !== -1) {
          squad.soldiers.splice(index, 1);
          await squad.save();
        }
      }
    }

    res.send(soldier);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
