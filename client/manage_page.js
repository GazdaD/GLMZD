const express = require("express");
const router = express.Router();
const Administrator = require("../models/administrator");
const Soldier = require("../models/soldier");

router.get("/manage-soldiers", async (req, res) => {
  try {
    const soldiers = await Soldier.find();

    // Grouping soldiers by platoons and squads
    const groupedData = soldiers.reduce((acc, soldier) => {
      const platoon = soldier.platoonNumber;
      const squad = soldier.squadNumber;

      if (!acc[platoon]) {
        acc[platoon] = { squads: {} };
      }

      if (!acc[platoon].squads[squad]) {
        acc[platoon].squads[squad] = [];
      }

      acc[platoon].squads[squad].push(soldier);
      return acc;
    }, {});

    res.render("manage_page/manage_page", { soldiers, groupedData });
  } catch (error) {
    console.error("Error fetching soldiers:", error);
    res.status(500).send("Помилка при отриманні даних про військових");
  }
});

router.post("/add-soldier", async (req, res) => {
  try {
    const newSoldier = new Soldier(req.body);
    await newSoldier.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error adding soldier:", error);
    res.json({ success: false, error });
  }
}); 

router.put("/edit-soldier/:id", async (req, res) => {
  try {
    await Soldier.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating soldier:", error);
    res.json({ success: false, error });
  }
});

router.delete("/delete-soldier/:id", async (req, res) => {
  try {
    await Soldier.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting soldier:", error);
    res.json({ success: false, error });
  }
});

module.exports = router;
