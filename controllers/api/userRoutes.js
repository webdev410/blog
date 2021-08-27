const router = require("express").Router();
const { User } = require("../../models");

//! Routes for api/users endpoint

// route for /api/users
// get JSON of all users
router.get("/", (req, res) => {
  if (req.session.user_id === 1) {
    User.findAll().then((data) => {
      res.json(data);
    });
  } else {
    res.status(400).json(err);
  }
});

// CREATE new user
router.post("/", async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    // Set up sessions with a 'logged_In' variable set to `true`
    req.session.save(() => {
      req.session.logged_in = true;
      req.session.page_visited = "Login";
      req.session.email = dbUserData.email;
      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// check if user is registered
// * also includes the session object creation
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }
    // password validation
    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }
    // ! create the session object
    req.session.save(() => {
      req.session.page_visited = userData.page_visited;
      req.session.user_id = userData.id;
      req.session.email = userData.email;
      req.session.isAdmin = userData.isAdmin;
      req.session.username = userData.username;
      // set logged in to true
      req.session.logged_in = true;
      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// destroy session on logout
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
