const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Soldier = require("../models/soldier");
const Squad = require("../models/squad");
const Platoon = require("../models/platoon");
const Company = require("../models/company");
const DisciplinaryRecord = require("../models/disciplinaryRecord");

router.post("/", async (req, res) => {
  try {
    const { soldierId, type, description, issuedBy, date } = req.body;

    const soldier = await Soldier.findById(soldierId);
    if (!soldier) {
      return res.status(404).json({ message: "Солдат не знайдений" });
    }

    const newRecord = new DisciplinaryRecord({
      soldier: soldierId,
      type,
      description,
      issuedBy,
      date,
    });

    await newRecord.save();

    res.status(201).json(newRecord); 
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Помилка при додаванні дисциплінарної практики" });
  }
});

module.exports = router;
