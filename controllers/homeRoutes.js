const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
	try {
		// gets all posts to display on the homepage
		const postData = await Post.findAll({
			attributes: ["id", "title", "text", "createdAt", "user_id"],
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
		logged_in: false,
		title: "Register",
	});
});
// ! FRONT END ROUTES

// * Route for /dash
router.get("/dashboard", async (req, res) => {
	console.info(`${req.method} request received for dashboard`);
	// gets all posts to display on the page
	const postData = await Post.findAll({
		attributes: ["title", "text", "createdAt", "user_id", "id"],
	});

	const posts = postData.map((post) => post.get({ plain: true }));
	if (!req.session.logged_in) {
		res.redirect("/login");
	} else {
		res.render("dashboard", {
			posts,
			//pass data into page
			logged_in: true,
			username: req.session.username,
			email: req.session.email,
			// page information
			title: "Dashboard",
		});
	}
});
// * Front-End Route for one post's details
router.get("/post/:id", async (req, res) => {
	const postData = await Post.findByPk(req.params.id, {
		attributes: ["id", "title", "text", "createdAt", "user_id"],
		include: [
			{
				model: User,
				attributes: ["id", "username", "email"],
			},
		],
		include: [
			{
				model: Comment,
				attributes: [
					"id",
					"comment",
					"post_id",
					"user_id",
					"createdAt",
				],
			},
		],
	});

	const post = postData.get({ plain: true });
	console.log(post);
	res.render("post-details", {
		post,
		username: req.session.username,

		email: req.session.email,
		logged_in: req.session.logged_in,
		title: "Post Details",
	});
});

// JSON Object
// get one product
router.get("/post/:id", (req, res) => {
	// find a single product by its `id`
	Post.findByPk(req.params.id, {
		attributes: ["id", "title", "text", "user_id", "createdAt"],
		include: [
			{
				model: User,
				attributes: ["id", "username", "email"],
			},
		],
		include: [
			{
				model: Comment,
				attributes: [
					"id",
					"comment",
					"createdAt",
					"post_id",
					"user_id",
				],
			},
		],
	}).then((data) => {
		res.json(data);
	});
});

module.exports = router;
