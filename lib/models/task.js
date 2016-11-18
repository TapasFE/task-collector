module.exports = function (sequelize, DataTypes) {
  const Task = sequelize.define('Task', {
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    content: DataTypes.TEXT,
  }, {
    indexes: [{
      fields: ['date', 'userId'],
      unique: true,
    }],
  });
  Task.associate = function (models) {
    Task.belongsTo(models.User, {as: 'user'});
    Task.belongsToMany(models.User, {
      as: 'admirers',
      through: 'task_admirers',
      foreignKey: 'taskId',
      otherKey: 'admirerId',
    });
  };
  return Task;
};