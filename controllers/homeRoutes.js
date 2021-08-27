const router = require("express").Router();
const User = require("../models/User");

const withAuth = require("../utils/auth");

router.get("/", withAuth, async (req, res) => {
  try {
    // creates a users object for admin dashboard reporting
    const userData = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["username", "ASC"]],
    });

    const users = userData.map((project) => project.get({ plain: true }));

    console.log(users);
    res.render("dashboard", {
      //pass data into page
      logged_in: req.session.logged_in,
      username: req.session.username,
      email: req.session.email,
      // page information
      title: "Dashboard",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("login", {
    title: "Login",
  });
});
// Route for register form
router.get("/register", (req, res) => {
  res.render("register", {
    logged_in: req.session.logged_in,
    title: "Register",
  });
});

// ! FRONT END PAGE ROUTES HERE

module.exports = router;
