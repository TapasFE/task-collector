module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    openId: {
      type: DataTypes.STRING,
      unique: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
  });
  User.associate = function (models) {
    User.hasMany(models.Task);
  };
  return User;
};