const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // on utilise try...catch car de nombreux problème peuvent se produire
  try {
    // on extrait le token du header authorization et on utilise split pour récuper tout ce qui a apres l'espace
    const token = req.headers.authorization.split(" ")[1];
    // verify va décoder le token
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    // on extrait l'id utilisateur du token
    const userId = decodedToken.userId;
    // si la demande contient un id user, on le compare à celui extrait du token,
    // si ils sont différents, on génère une erreur.
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID invalid !";
      // sinon, tout fonctionne et l'user est authentifié
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "Unauthenticated request" });
  }
};
