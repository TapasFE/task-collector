const Router = require('koa-router');
const {User, Task} = require('../../models');

const router = new Router({
  prefix: '/api',
})
.get('/tasks', function* (next) {
  const {user, date} = this.query;
  let dateObj = new Date(date);
  if (!dateObj.getTime()) dateObj = new Date();
  const data = yield Task.findAndCountAll({
    include: [{
      model: User,
      where: {
        name: user,
      },
    }],
    where: {
      date: dateObj.toDateString(),
    },
  });
  this.body = data;
})
.post('/tasks', function* (next) {
  const {user, content} = this.request.body || {};
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
      date: new Date().toDateString(),
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
