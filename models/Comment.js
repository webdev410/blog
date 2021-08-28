const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Comment extends Model {
	checkPassword(loginPw) {
		return bcrypt.compareSync(loginPw, this.password);
	}
}

Comment.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		comment: {
			type: DataTypes.STRING,
		},
		post_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "posts",
				key: "id",
			},
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
		},
	},
	{
		sequelize,
		modelName: "comment",
	}
);

module.exports = Comment;
