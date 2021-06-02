const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Création d'une sauce
router.post("/", auth, multer, sauceCtrl.createSauce);

// nombre de like
router.post("/:id/like", auth, sauceCtrl.likeSauce);

// Modification d'une sauce
router.put("/:id", auth, multer, sauceCtrl.modifiedSauce);

// Suppression d'une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// récupération d'une sauce spécifique grâce à l'id
router.get("/:id", auth, sauceCtrl.getOneSauce);

// récupération de la liste des sauces
router.get("/", auth, sauceCtrl.getAllSauce);

module.exports = router;
