const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");
router.get("/", withAuth, (req, res) => {
	Post.findAll({
		where: {
			user_id: req.session.user_id,
		},
		attributes: ["id", "post_title", "post_body", "createdAt"],
		include: [
			{
				model: Comment,
				attributes: [
					"id",
					"comment_body",
					"post_id",
					"user_id",
					"createdAt",
				],
				include: {
					model: User,
					attributes: ["username", "email"],
				},
			},
			{
				model: User,
				attributes: ["username", "email"],
			},
		],
	})

		.then((postData) => {
			const posts = postData.map((post) => post.get({ plain: true }));
			res.render("dashboard", { posts, logged_in: true });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});
router.get("/edit/:id", withAuth, (req, res) => {
	Post.findOne({
		where: {
			id: req.params.id,
		},

		attributes: ["id", "post_title", "post_body", "createdAt"],
		include: [
			{
				model: User,
				attributes: ["username", "email"],
			},
			{
				model: Comment,
				attributes: [
					"id",
					"comment_body",
					"post_id",
					"user_id",
					"createdAt",
				],
				include: {
					model: User,
					attributes: ["username", "email"],
				},
			},
		],
	})
		.then((postData) => {
			if (!postData) {
				res.status(404).json({ message: "No post found with this id" });
				return;
			}

			const post = postData.get({ plain: true });
			res.render("edit-post", { post, logged_in: true });
		})

		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});
router.get("/new", (req, res) => {
	res.render("new-post");
});

module.exports = router;
