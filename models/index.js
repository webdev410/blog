const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

Post.belongsTo(User, {
	foreignKey: "user_id",
});

User.hasMany(Post, {
	foreignKey: "user_id",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
Post.hasMany(Comment, {
	foreignKey: "post_id",
});

Comment.belongsTo(User, {
	through: Comment,
	foreignKey: "user_id",
});

module.exports = {
	User,
	Post,
	Comment,
};
