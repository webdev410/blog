const router = require("express").Router();
const { Post, User } = require("../../models");

const withAuth = require("../../utils/auth");

// * Create a new post
router.post("/", async (req, res) => {
  try {
    const newPost = req.body;
    const postData = await Post.create({
      ...newPost,
      user_id: req.session.user_id,
    });
    res.status(200).json(postData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// router.get("/:id", withAuth, async (req, res) => {
//   console.info(`${req.method} request received for post details`);
//   try {
//     const thisPost = await Post.findAll({
//       attributes: ["id", "title", "text", "createdAt"],
//     });
//
//     const post = thisPost.map((post) => post.get({ plain: true }));
//
//     res.render("post-details", {
//       post,
//       logged_in: req.session.logged_in,
//       email: req.session.email,
//       username: req.session.username,
//       title: "Home",
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
