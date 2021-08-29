const router = require("express").Router();
const { Post, User, Comment } = require("../../models");
const sequelize = require("../../config/connection");
const withAuth = require("../../utils/auth");

router.get("/", (req, res) => {
	console.log("======================");
	Post.findAll({
		attributes: ["id", "post_title", "post_body", "created_at"],
		order: [["created_at", "DESC"]],
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
		.then((postData) => res.json(postData.reverse()))
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});
router.get("/:id", (req, res) => {
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
			res.json(postData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.post("/", withAuth, (req, res) => {
	Post.create({
		post_title: req.body.post_title,
		post_body: req.body.post_body,
		user_id: req.session.user_id,
	})
		.then((postData) => res.json(postData))
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.put("/:id", withAuth, (req, res) => {
	Post.update(
		{
			post_title: req.body.post_title,
			post_body: req.body.post_body,
		},
		{
			where: {
				id: req.params.id,
			},
		}
	)
		.then((postData) => {
			if (!postData) {
				res.status(404).json({ message: "No post found with this id" });
				return;
			}
			res.json(postData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});
router.delete("/:id", withAuth, (req, res) => {
	Post.destroy({
		where: {
			id: req.params.id,
		},
	})
		.then((postData) => {
			if (!postData) {
				res.status(404).json({ message: "No post found with this id" });
				return;
			}

			res.json(postData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
