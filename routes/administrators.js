const express = require('express');
const router = express.Router();
const Administrator = require('../models/administrator');

router.post('/', async (req, res) => {
  try {
    const { login, password, fullName, soldierID, companyID, role } = req.body;
    const newAdmin = new Administrator({
      login,
      password,
      fullName,
      soldierID,
      companyID,
      role
    });

    await newAdmin.save();
    res.status(201).send(newAdmin);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const administrators = await Administrator.find();
    res.status(200).send(administrators);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/:login', async (req, res) => {
  try {
    const admin = await Administrator.findOne({ login: req.params.login });
    if (!admin) {
      return res.status(404).send('Administrator not found');
    }
    res.status(200).send(admin);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/:login', async (req, res) => {
  try {
    const { login, password, fullName, soldierID, companyID, role } = req.body;
    const admin = await Administrator.findOneAndUpdate(
      { login: req.params.login },
      { login, password, fullName, soldierID, companyID, role },
      { new: true, runValidators: true }
    );

    if (!admin) {
      return res.status(404).send('Administrator not found');
    }

    res.status(200).send(admin);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/:login', async (req, res) => {
  try {
    const admin = await Administrator.findOneAndDelete({ login: req.params.login });
    if (!admin) {
      return res.status(404).send('Administrator not found');
    }
    res.status(200).send('Administrator deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
