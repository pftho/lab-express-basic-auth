const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const { isLoggedIn } = require("../middleware/route-guard.js");

// ...

//SIGN UP

router.get("/signup", (req, res) => {
  console.log(req.session);
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

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/auth/profile");
      } else {
        res.render("auth/login", { erroMessage: "Incorrect Password" });
      }
    })
    .catch((err) => console.log(err));
});

//PROFILE PAGE
router.get("/profile", (req, res) => {
  const { currentUser } = req.session;
  res.render("auth/profile", currentUser);
});

//MAIN PAGE
router.get("/profile/main", isLoggedIn, (req, res) => {
  const { currentUser } = req.session;
  res.render("main");
});

//PRIVATE PAGE
router.get("/profile/private", isLoggedIn, (req, res) => {
  const { currentUser } = req.session;
  res.render("private");
});

module.exports = router;
