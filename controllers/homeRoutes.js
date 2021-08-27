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
