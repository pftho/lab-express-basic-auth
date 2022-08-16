const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

//SIGN UP

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  console.log("req.body", req.body);

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // console.log("hashedPassword", hashedPassword);
      return User.create({ username, password: hashedPassword });
    })
    .then((userfromDB) => {
      // console.log("userfromDB", userfromDB);
      // console.log("req.session", req.session);
      req.session.currentUser = userfromDB;
      res.redirect("/auth/profile");
    })
    .catch((err) => console.log(err));
});

//LOGIN

router.get("/login", (req, res) => {});

router.post("/login", (req, res) => {});

module.exports = router;

//PROFILE PAGE
router.get("/profile", (req, res) => {
  const { username } = req.session.currentUser;
  res.render("auth/profile", { username });
});
