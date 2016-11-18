const Router = require('koa-router');
const {User, Task} = require('../../models');

const router = new Router({
  prefix: '/api',
})
.get('/tasks', function* (next) {
  let {user, date} = this.query;
  user = user && user.trim();
  const includeUser = {
    model: User,
  };
  if (user) includeUser.where = {name: user};
  let data;
  if (user && date === 'lastDay') {
    data = yield Task.findAndCountAll({
      include: [includeUser],
      limit: 1,
      order: 'date DESC',
      where: {
        date: {
          $lt: new Date(new Date().toDateString()),
        },
      },
    });
  } else {
    let dateObj = new Date(date);
    if (!dateObj.getTime()) dateObj = new Date();
    data = yield Task.findAndCountAll({
      include: [includeUser],
      where: {
        date: new Date(dateObj.toDateString()),
      },
    });
  }
  this.body = data;
})
.post('/tasks', function* (next) {
  let {user, content} = this.request.body || {};
  user = user && user.trim();
  if (!user) {
    this.status = 400;
    return;
  }
  const [userObj, created] = yield User.findOrCreate({
    where: {
      name: user,
    },
  });
  try {
    const task = yield Task.create({
      userId: userObj.id,
      date: new Date(new Date().toDateString()),
      content,
    });
    this.status = 201;
    this.body = task;
  } catch (e) {
    if (e && e.name === 'SequelizeUniqueConstraintError') {
      this.body = {message: e.message};
      this.status = 422;
    } else {
      throw e;
    }
  }
})

module.exports = router.routes();
