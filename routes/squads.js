const express = require("express");
const router = express.Router();
const Squad = require("../models/squad");
const Platoon = require("../models/platoon");
const Soldier = require("../models/soldier");

router.post("/:platoonId", async (req, res) => {
  try {
    const { squadNumber, squadCommander, soldiers} = req.body;
    const platoonId = req.params.platoonId;

    if (squadCommander) {
      const commander = await Soldier.findById(squadCommander);
      if (!commander) {
        return res.status(404).json({ message: "Commander not found" });
      }
    }

    const squad = new Squad(req.body);
    await squad.save();

    const platoon = await Platoon.findById(platoonId);
    if (!platoon) {
      return res.status(404).json({ message: "Platoon not found" });
    }

    platoon.squads.push(squad._id);
    await platoon.save();

    res.status(201).send(squad);
  } catch (err) {
    console.error("Error creating squad:", err);
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const squads = await Squad.find()
      .populate("squadCommander")
      .populate("soldiers");
    res.send(squads);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const squad = await Squad.findById(req.params.id)
      .populate("squadCommander")
      .populate("soldiers");
    if (!squad) {
      return res.status(404).send("Squad not found");
    }
    res.send(squad);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const squad = await Squad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!squad) {
      return res.status(404).send("Squad not found");
    }
    res.send(squad);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const squad = await Squad.findByIdAndDelete(req.params.id);
    if (!squad) {
      return res.status(404).send("Squad not found");
    }
    res.send(squad);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
