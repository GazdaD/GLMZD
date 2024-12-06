const express = require("express");
const router = express.Router();
const Company = require("../models/company");
const Soldier = require("../models/soldier");

router.post("/", async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).send(company);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("commanders")
      .populate("platoons");
    res.send(companies);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate("commanders")
      .populate("platoons");
    if (!company) {
      return res.status(404).send("Company not found");
    }
    res.send(company);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!company) {
      return res.status(404).send("Company not found");
    }
    res.send(company);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).send("Company not found");
    }
    res.send(company);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/:id/commanders", async (req, res) => {
  try {
    const { soldierId } = req.body;
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).send("Company not found");
    }

    const soldier = await Soldier.findById(soldierId);
    if (!soldier) {
      return res.status(404).send("Soldier not found");
    }

    company.commanders.push(soldierId);
    await company.save();
    res.status(201).send(company);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:id/commanders/:soldierId", async (req, res) => {
  try {
    const { id, soldierId } = req.params;
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).send("Company not found");
    }

    const commanderIndex = company.commanders.indexOf(soldierId);
    if (commanderIndex === -1) {
      return res.status(404).send("Commander not found in this company");
    }

    company.commanders.splice(commanderIndex, 1);
    await company.save();
    res.send(company);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
