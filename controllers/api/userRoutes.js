const router = require("express").Router();

const { User, Post, Comment } = require("../../models");
router.get("/", (req, res) => {
	User.findAll({
		attributes: { exclude: ["[password"] },
	})
		.then((userData) => res.json(userData))
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.get("/:id", (req, res) => {
	User.findOne({
		attributes: { exclude: ["password"] },
		where: {
			id: req.params.id,
		},
		include: [
			{
				model: Post,
				attributes: ["id", "title", "content", "created_at"],
			},

			{
				model: Comment,
				attributes: ["id", "comment_body", "created_at"],
				include: {
					model: Post,
					attributes: ["title"],
				},
			},
			{
				model: Post,
				attributes: ["title"],
			},
		],
	})
		.then((userData) => {
			if (!userData) {
				res.status(404).json({ message: "No user found with this id" });
				return;
			}
			res.json(userData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.post("/", (req, res) => {
	User.create({
		username: req.body.username,
		password: req.body.password,
	})

		.then((userData) => {
			req.session.save(() => {
				req.session.user_id = userData.id;
				req.session.username = userData.username;
				req.session.logged_in = true;

				res.json(userData);
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.post("/login", (req, res) => {
	User.findOne({
		where: {
			username: req.body.username,
		},
	})
		.then((userData) => {
			if (!userData) {
				res.status(400).json({
					message: "No user with that username!",
				});
				return;
			}
			const validPassword = userData.checkPassword(req.body.password);

			if (!validPassword) {
				res.status(400).json({ message: "Incorrect password!" });
				return;
			}
			req.session.save(() => {
				req.session.user_id = userData.id;
				req.session.username = userData.username;
				req.session.logged_in = true;
				res.json({
					user: userData,
					message: "You are now logged in!",
				});
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.post("/logout", (req, res) => {
	if (req.session.logged_in) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
});

router.put("/:id", (req, res) => {
	User.update(req.body, {
		individualHooks: true,
		where: {
			id: req.params.id,
		},
	})
		.then((userData) => {
			if (!userData[0]) {
				res.status(404).json({ message: "No user found with this id" });
				return;
			}
			res.json(userData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.delete("/:id", (req, res) => {
	User.destroy({
		where: {
			id: req.params.id,
		},
	})
		.then((userData) => {
			if (!userData) {
				res.status(404).json({ message: "No user found with this id" });
				return;
			}
			res.json(userData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
