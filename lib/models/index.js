const db = require('./db');
const User = require('./user');
const Task = require('./task');

User.hasMany(Task);
Task.belongsTo(User);

module.exports = {
  sync: db.sync.bind(db),
  User,
  Task,
};
