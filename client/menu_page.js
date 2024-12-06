const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('menu_page/menu_page', { userRole: req.session.user.role });
});

module.exports = router;