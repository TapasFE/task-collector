module.exports = function (sequelize, DataTypes) {
  const TaskAdmirer = sequelize.define('TaskAdmirer', {}, {
    tableName: 'task_admirers',
  });
  return TaskAdmirer;
};
