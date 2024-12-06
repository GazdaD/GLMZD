const express = require("express");
const axios = require("axios");
const router = express.Router();
const Soldier = require("../models/soldier");
const Company = require("../models/company");

router.get("/view", async (req, res) => {
  try {
    const companyID = req.session.user.companyID;

    const company = await Company.findById(companyID);

    if (!company) {
      return res.status(404).send("Company not found");
    }

    const soldiers = await Soldier.find({ companyNumber: company.companyNumber }).populate("disciplinaryRecords");

    const groupedData = soldiers.reduce((acc, soldier) => {
      const platoonNumber =
        soldier.platoonNumber && soldier.platoonNumber.trim() !== "-"
          ? soldier.platoonNumber.trim()
          : "Керівний склад підрозділу";
      const squadNumber =
        soldier.squadNumber && soldier.squadNumber.trim() !== "-"
          ? soldier.squadNumber.trim()
          : "Начальник курсу та курсовий офіцер";

      acc[platoonNumber] = acc[platoonNumber] || { squads: {} };
      acc[platoonNumber].squads[squadNumber] =
        acc[platoonNumber].squads[squadNumber] || [];
      acc[platoonNumber].squads[squadNumber].push(soldier);

      return acc;
    }, {});

    res.render("main_page/main_page", { groupedData });
  } catch (err) {
    console.error("Помилка при отриманні даних про солдатів:", err);
    res.status(500).send(err);
  }
});

module.exports = router;
