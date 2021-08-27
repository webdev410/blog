const router = require("express").Router();
const { Post, User } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", withAuth, async (req, res) => {
  try {
    // gets all posts to display on the page
    const postData = await Post.findAll({
      attributes: ["title", "text", "createdAt"],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render("dashboard", {
      posts,
      //pass data into page
      logged_in: true,
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

// * Route for /home
router.get("/home", (req, res) => {
  console.info(`${req.method} request received for homepage`);
  if (!req.session.logged_in) {
    res.redirect("/login");
  } else {
    res.render("home", {
      email: req.session.email,
      logged_in: true,
      username: req.session.username,
      title: "Home",
    });
  }
});

module.exports = router;
