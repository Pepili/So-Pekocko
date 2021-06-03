const mongoose = require("mongoose");

// schema de données comportant les champs des sauces
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: [{ type: String, required: true }],
  usersDisliked: [{ type: String, required: true }],
});

// exporter le modele correspondant
module.exports = mongoose.model("sauce", sauceSchema);
