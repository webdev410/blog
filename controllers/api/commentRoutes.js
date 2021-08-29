const router = require("express").Router();
const { Post, User, Comment } = require("../../models");

const withAuth = require("../../utils/auth");

// * Create a new comment
// route is /api/comment
router.post("/", withAuth, async (req, res) => {
	try {
		const newComment = req.body;
		const commentData = await Comment.create({
			...newComment,
			user_id: req.session.user_id,
			post_id: req.body.post_id,
		});
		res.status(200).json(commentData);
	} catch (err) {
		res.status(400).json(err);
	}
});
router.get("/:id", (req, res) => {
	Comment.findAll({
		where: {
			id: req.params.id,
		},
		attributes: ["id", "comment_body", "post_id", "user_id", "createdAt"],
		include: [
			{
				model: Post,
				attributes: ["id", "post_id", "post_body", "user_id"],
				include: {
					model: User,
					attributes: ["id", "username", "email"],
				},
			},
		],
	})
		.then((dbCommentData) => res.json(dbCommentData))
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});
//
// router.get("/:id", withAuth, async (req, res) => {
// 	console.info(`${req.method} request received for comment`);
// 	try {
// 		const thisComment = await Comment.findAll({
// 			where: {
// 				id: req.params.id,
// 			},
// 			attributes: [
// 				"id",
// 				"comment_body",
// 				"post_id",
// 				"user_id",
// 				"createdAt",
// 			],
// 			include: [
// 				{
// 					model: Post,
// 					attributes: ["id", "post_id", "post_body", "user_id"],
// 					include: {
// 						model: User,
// 						attributes: ["id", "username", "email"],
// 					},
// 				},
// 			],
// 		});
//
// 		const comment = thisComment.map((data) => data.get({ plain: true }));
//
// 		res.render("post-details", {
// 			comment,
// 			logged_in: req.session.logged_in,
// 			email: req.session.email,
// 			username: req.session.username,
// 			title: "Home",
// 		});
// 	} catch (err) {
// 		res.status(500).json(err);
// 	}
// });

module.exports = router;
