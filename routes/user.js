const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

// création de compte
router.post("/signup", userCtrl.signup);

// authentification de compte
router.post("/login", userCtrl.login);

// récupération des users
router.get("/me", userCtrl.me);

module.exports = router;
