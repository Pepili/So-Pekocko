// Package permettant de gérer les fichiers entrants dans les request HTTP
const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
const storage = multer.diskStorage({
  // indique à multer d'enregistrer les fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // indique à multer d'utiliser le nom d'origine et de remplacer les espaces par des underscores
    const name = file.originalname.split(" ").join("_");
    // permet de résoudre l'extension de fichier appropriée
    const extension = MIME_TYPES[file.mimetype];
    // on ajoute un timestamp Date.now() comme nom de fichier.
    callback(null, name + Date.now() + "." + extension);
  },
});
// on exporte multer en lui passant storage et en lui indiquant qu'on génére uniquement les fichiers image
module.exports = multer({ storage }).single("image");
