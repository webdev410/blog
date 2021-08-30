const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");
router.get("/", withAuth, (req, res) => {
	Post.findAll({
		where: {
			user_id: req.session.user_id,
		},
		attributes: ["id", "title", "content", "created_at"],
		include: [
			{
				model: Comment,
				attributes: [
					"id",
					"comment_body",
					"post_id",
					"user_id",
					"created_at",
				],
				include: {
					model: User,
					attributes: ["username"],
				},
			},
			{
				model: User,
				attributes: ["username"],
			},
		],
	})

		.then((postData) => {
			const posts = postData.map((post) => post.get({ plain: true }));
			res.render("dashboard", {
				posts,
				username: req.session.username,
				logged_in: true,
				title: "Dashboard",
			});
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

		attributes: ["id", "title", "content", "created_at"],
		include: [
			{
				model: User,
				attributes: ["username"],
			},
			{
				model: Comment,
				attributes: [
					"id",
					"comment_body",
					"post_id",
					"user_id",
					"created_at",
				],
				include: {
					model: User,
					attributes: ["username"],
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
			res.render("edit-post", {
				post,
				username: req.session.username,
				logged_in: true,
				title: "Edit Post",
			});
		})

		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});
router.get("/new", (req, res) => {
	res.render("add-post", {
		title: "Add Post",
		username: req.session.username,
		logged_in: true,
	});
});

module.exports = router;
