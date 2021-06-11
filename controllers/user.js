const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const regexEmail =
  /^[a-zA-Z0-9.!#$%&'*+\\\/=?^_`{|}~\-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9\-]{2,63}$/;
const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

exports.signup = (req, res, next) => {
  if (!regexEmail.test(req.body.email)) {
    return res
      .status(401)
      .json({ error: "'Please fill in the form fields correctly'" });
  } else if (!regexPassword.test(req.body.password)) {
    return res.status(401).json({
      error:
        "Your password must contain at least 8 characters, one lower case, one upper case, one number and one special character",
    });
  } else {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        new user({
          email: req.body.email,
          password: hash,
        })
          .save()
          .then(() => res.status(201).json({ message: " User created !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

exports.login = (req, res, next) => {
  user
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "User not found..." });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Wrong password..." });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
