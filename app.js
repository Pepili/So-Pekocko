const express = require("express");
const mongoose = require("mongoose");
// donne accès au chemin du système de fichier
const path = require("path");
const app = express();
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

mongoose
  .connect(
    // adresse SRV qui contient l'utilisateur et le mot de passe MongoDB
    "mongodb+srv://Pepili:1BWRHCd8YOI7uKES@cluster0.dyede.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

/* Ces headers permettent d'accéder à l'API depuis n'importe quelle origine,
d'ajouter les headers aux requêtes envoyées vers l'API,
d'envoyer des requêtes avec les méthodes indiquées */
app.use((res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());
// indique à express de gérer la ressource images de manière statique à chaque requête vers /images
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
