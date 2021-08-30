const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const router = require("express").Router();
router.get("/", (req, res) => {
	Post.findAll({
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
			res.render("home", {
				posts,
				username: req.session.username,
				logged_in: req.session.logged_in,
				title: "Home",
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.get("/login", (req, res) => {
	if (req.session.logged_in) {
		res.redirect("/");
		return;
	}
	res.render("login", {
		title: "Login",
		username: req.session.username,
	});
});

router.get("/signup", (req, res) => {
	res.render("signup", {
		title: "Sign Up",
		username: req.session.username,
	});
});

router.get("/post/:id", (req, res) => {
	Post.findOne({
		where: {
			id: req.params.id,
		},
		attributes: ["id", "content", "title", "created_at"],
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
			if (!postData) {
				res.status(404).json({ message: "No post found with this id" });
				return;
			}
			const post = postData.get({ plain: true });
			console.log(post);
			res.render("post-details", {
				post,
				logged_in: req.session.logged_in,
				username: req.session.username,
				title: "Post",
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});
router.get("/posts-comments", (req, res) => {
	Post.findOne({
		where: {
			id: req.params.id,
		},
		attributes: ["id", "content", "title", "created_at"],
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
			if (!postData) {
				res.status(404).json({ message: "No post found with this id" });
				return;
			}
			const post = postData.get({ plain: true });

			res.render("posts-comments", {
				post,
				username: req.session.username,
				logged_in: req.session.logged_in,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
