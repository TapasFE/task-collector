const models = require('../lib/models');

function createUser(name) {
  return models.User.create({name})
  .catch(e => models.User.findOne({where: {name}}));
}

function createUsers() {
  return Promise.all([
    'test1',
    'test2',
  ].map(createUser));
}

function createTasks(date, users) {
  return Promise.all(users.map(user => {
    return models.Task.create({
      date,
      userId: user.id,
      content: JSON.stringify({
        lastDay: `lastDay ${date}`,
        today: `today ${date}`,
        risks: `risks ${date}`,
      }),
    }).catch(e => {});
  }));
}

models.sync()
.then(() => createUsers())
.then(users => {
  const promises = [];
  for (let i = 1; i < 10; i++) {
    const date = new Date(new Date(Date.now() - i * 24 * 60 * 60 * 1000).toDateString());
    promises.push(createTasks(date, users));
  }
  return Promise.all(promises);
});
