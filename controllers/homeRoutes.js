const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const router = require("express").Router();

router.get("/", async (req, res) => {
	try {
		// gets all posts to display on the page
		const postData = await Post.findAll({
			attributes: [
				"id",
				"post_title",
				"post_body",
				"user_id",
				"createdAt",
			],
			include: [
				{
					model: User,
					attributes: ["id", "username", "email"],
					include: {
						model: Comment,
						attributes: [
							"id",
							"comment_body",
							"post_id",
							"user_id",
						],
					},
				},
			],
		});

		const posts = postData.map((post) => post.get({ plain: true }));
		res.render("home", {
			posts,
			logged_in: req.session.logged_in,
			email: req.session.email,
			username: req.session.username,
			title: "Home",
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
//
// router.get("/", (req, res) => {
// 	Post.findAll({
// 		attributes: ["id", "post_title", "post_body", "createdAt"],
// 		include: [
// 			{
// 				model: Comment,
// 				attributes: [
// 					"id",
// 					"comment_body",
// 					"post_id",
// 					"user_id",
// 					"createdAt",
// 				],
// 				include: {
// 					model: User,
// 					attributes: ["username", "email"],
// 				},
// 			},
// 			{
// 				model: User,
// 				attributes: ["username", "email"],
// 			},
// 		],
// 	})
//
// 		.then((postData) => {
// 			const posts = postData.map((post) => post.get({ plain: true }));
// 			res.render("home", { posts, logged_in: req.session.logged_in });
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 			res.status(500).json(err);
// 		});
// });
//
// router.get("/login", (req, res) => {
// 	if (req.session.logged_in) {
// 		res.redirect("/");
// 		return;
// 	}
// 	res.render("login");
// });
//
// router.get("/register", (req, res) => {
// 	res.render("register");
// });

router.get("/post/:id", (req, res) => {
	Post.findOne({
		where: {
			id: req.params.id,
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
					attributes: ["username"],
				},
			},
			{
				model: User,
				attributes: ["username", "email"],
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
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});
router.get("/show-comments", (req, res) => {
	Post.findOne({
		where: {
			id: req.params.id,
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
			if (!postData) {
				res.status(404).json({ message: "No post found with this id" });
				return;
			}
			const post = postData.get({ plain: true });

			res.render("show-comments", {
				post,
				logged_in: req.session.logged_in,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
