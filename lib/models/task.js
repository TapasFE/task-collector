const Sequelize = require('sequelize');
const db = require('./db');

const Task = db.define('task', {
  date: {
    type: Sequelize.DATEONLY,
    defaultValue: Sequelize.NOW,
  },
  content: Sequelize.TEXT,
}, {
  indexes: [{
    fields: ['date', 'userId'],
    unique: true,
  }],
});

module.exports = Task;
