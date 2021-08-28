const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Post extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    text: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.INTEGER,
      //   references: {
      //     model: "user",
      //     key: "id",
      //   },
    },
  },
  {
    sequelize,
    modelName: "post",
  }
);

module.exports = Post;
