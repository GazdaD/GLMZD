const express = require("express");
const router = express.Router();
const Soldier = require("../models/soldier");
const DisciplinaryRecord = require("../models/disciplinaryRecord");

router.get("/add-disciplinary-record", async (req, res) => {
  try {
    const userId = req.session.user.soldierID;
    const user = await Soldier.findById(userId);

    let soldiers;

    if (
      user.position === "Начальник курсу" ||
      user.position === "Курсовий офіцер"
    ) {
      soldiers = await Soldier.find({
        position: { $nin: ["Начальник курсу", "Курсовий офіцер"] },
      });
    } else if (req.session.user.role === "Командир взводу") {
      soldiers = await Soldier.find({
        platoonNumber: user.platoonNumber,
        position: { $ne: "Командир взводу" },
      });
    } else if (
      req.session.user.role === "Командир 1 відділення" ||
      req.session.user.role === "Командир 2 відділення" ||
      req.session.user.role === "Командир 3 відділення"
    ) {
      soldiers = await Soldier.find({
        platoonNumber: user.platoonNumber,
        squadNumber: user.squadNumber,
        position: { $ne: req.session.user.role },
      });
    } else {
      soldiers = [];
    }

    res.render("add_records_page/add_records_page", { soldiers });
  } catch (err) {
    console.error("Помилка при отриманні даних про солдатів:", err);
    res.status(500).send(err);
  }
});

router.post("/add", async (req, res) => {
  try {
    const { type, description, selectedSoldier } = req.body;

    if (!type || !description || !selectedSoldier) {
      return res
        .status(400)
        .json({ message: "Будь ласка, заповніть всі обов'язкові поля." });
    }

    const soldierData = JSON.parse(selectedSoldier);

    const soldier = await Soldier.findById(soldierData._id);
    if (!soldier) {
      return res.status(404).json({ message: "Військового не знайдено." });
    }

    const userId = req.session.user.soldierID;
    const user = await Soldier.findById(userId);

    const disciplinaryRecord = new DisciplinaryRecord({
      type,
      description,
      issuedBy: `${user.position}, ${user.rank} ${user.fullName}`,
    });

    await disciplinaryRecord.save();

    soldier.disciplinaryRecords.push(disciplinaryRecord);
    await soldier.save();

    res.status(200).json({ message: "Дисциплінарний запис успішно додано." });
  } catch (err) {
    console.error("Помилка при додаванні дисциплінарного запису:", err);
    res.status(500).json({
      message: "Сталася помилка при додаванні дисциплінарного запису.",
    });
  }
});

module.exports = router;
