'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      openId: {
        type: Sequelize.STRING,
        unique: true,
      },
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      avatar: Sequelize.STRING,
    })
    .then(() => queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW,
      },
      content: Sequelize.TEXT,
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'cascade',
      },
    }))
    .then(() => queryInterface.addIndex('tasks', [
      'date',
      'userId',
    ], {
      indicesType: 'UNIQUE',
    }))
    .then(() => queryInterface.createTable('task_admirers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      taskId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tasks',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      admirerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'cascade',
      },
    }))
    .then(() => queryInterface.addIndex('task_admirers', [
      'taskId',
      'admirerId',
    ], {
      indicesType: 'UNIQUE',
    }));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('task_admirers')
    .then(() => queryInterface.dropTable('tasks'))
    .then(() => queryInterface.dropTable('users'));
  }
};
