const router = require("express").Router();
const { Post, User, Comment } = require("../../models");

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
// * Create a new comment
// router.post("/comment", async (req, res) => {
// 	try {
// 		const newComment = req.body;
// 		const commentData = await Comment.create({
// 			...newComment,
// 			user_id: req.session.user_id,
// 			post_id: window.location.href.endsWith,
// 		});
// 		console.log(newComment), res.status(200).json(commentData);
// 	} catch (err) {
// 		res.status(400).json(err);
// 	}
// });

module.exports = router;
