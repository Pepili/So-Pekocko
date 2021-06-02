const sauce = require("../models/sauce");
const fs = require("fs");

// création d'une sauce
exports.createSauce = (req, res, next) => {
  // on analyse la string sauce avec JSON.parse pour obtenir un objet utilisable
  const sauceObject = JSON.parse(req.body.sauce);
  // suppression du faux id renvoyé par le front
  delete sauceObject._id;
  const Sauce = new sauce({
    ...sauceObject,
    /* on résout l'url de l'image en lui attribuant req.protocol 
    afin d'obtenir le premier segment 'http', puis req.get('host')
    pour résendre l'hôtre du serveur(localhost:3000) puis le dossier image
    et enfin le nom du fichier (req.file.filename)*/
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  return (
    Sauce
      // enregistre la méthode sauce dans la base de données
      .save()
      .then(() => res.status(201).json({ message: "Saved sauce" }))
      .catch((error) => res.status(400).json({ error }))
  );
};

// Nombre de like d'une sauce
exports.likeSauce = (req, res, next) => {
  // id de l'utilisateur
  const userId = req.body.userId;
  // type de like de l'utilisateur (like, dislike, annuler)
  const like = req.body.like;
  // id de la sauce liké envoyé dans les paramètres de requête
  const sauceId = req.params.id;
  if (!userId || typeof like === undefined || !sauceId) {
    return res.status(400).json({ message: "not found !" });
  }
  return sauce
    .findOne({ _id: sauceId })
    .then((Sauce) => {
      // on cherche la présence de l'userId dans les 2 tableaux
      const likeUserId = Sauce.usersLiked.findIndex((id) => id === userId);
      const dislikeUserId = Sauce.usersDisliked.findIndex(
        (id) => id === userId
      );
      // Si l'userId est présent dans aucun array, on l'ajoute à like
      if (like === 1 && likeUserId === -1 && dislikeUserId === -1) {
        Sauce.usersLiked.push(userId);
        res.status(200).json({ message: "User liked" });

        //Si on veut retirer un vote, on le supprime de partout
      } else if (like === 0) {
        Sauce.usersDisliked.splice(dislikeUserId, 1);
        Sauce.usersLiked.splice(likeUserId, 1);
        res.status(200).json({ message: "User has deleted his review" });

        //Si l'userId est présent dans aucun array, on l'ajoute à dislike
      } else if (like === -1 && likeUserId === -1 && dislikeUserId === -1) {
        Sauce.usersDisliked.push(userId);
        res.status(200).json({ message: "User disliked" });
      }
      Sauce.likes = Sauce.usersLiked.length;
      Sauce.dislikes = Sauce.usersDisliked.length;
      return Sauce.save()
        .then(() => res.status(200).json({ message: "UserId add" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

// modification d'une sauce
exports.modifiedSauce = (req, res, next) => {
  //on verifie si req.file existe, si il existe, on traite la nouvelle image
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : // si il n'existe pas, on traite simplement l'objet entrant
      { ...req.body };
  sauce
    .updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Modified sauce !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  sauce
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      //unlink permet de supprimer le fichier
      fs.unlink(`images/${filename}`, () => {
        sauce
          .deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Delete sauce !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Récupération d'une sauce en particulier
exports.getOneSauce = (req, res, next) => {
  sauce
    .findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// récupération de toute les sauces
exports.getAllSauce = (req, res, next) => {
  sauce
    // renvoyer un tableau contenant toutes les sauces
    .find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};