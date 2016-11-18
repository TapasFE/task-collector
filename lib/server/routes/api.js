const Router = require('koa-router');
const {User, Task} = require('../../models');

const router = new Router({
  prefix: '/api',
})
.use(function* (next) {
  if (!this.user.id) {
    this.status = 401;
    this.body = {
      message: 'Not authorized',
    };
  } else {
    yield* next;
  }
})
.get('/me', function* (next) {
  const data = yield User.findById(this.user.id, {
    attributes: [
      'id', 'name', 'email', 'avatar',
    ]
  });
  if (!data) {
    this.status = 404;
    return;
  }
  this.body = {data};
})
.get('/me/last_day_task', function* (next) {
  const today = new Date(new Date().toDateString());
  const data = yield Task.find({
    where: {
      date: {
        $lt: today,
      },
    },
    order: [
      ['date', 'DESC'],
    ],
  });
  this.body = {data};
})
.get('/tasks', function* (next) {
  let dateObj = new Date(this.query.date);
  if (!dateObj.getTime()) dateObj = new Date();
  const data = yield Task.findAll({
    where: {
      date: new Date(dateObj.toDateString()),
    },
    order: [
      ['createdAt', 'ASC'],
    ],
    attributes: ['id', 'content'],
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'avatar'],
    }, {
      model: User,
      as: 'admirers',
      through: 'task_admirers',
      attributes: ['id', 'name', 'avatar'],
    }],
  });
  this.body = {data};
})
.post('/tasks', function* (next) {
  const {content} = this.request.body || {};
  if (!content) {
    this.status = 400;
    return;
  }
  try {
    const data = yield Task.create({
      date: new Date(new Date().toDateString()),
      content,
      userId: this.user.id,
    });
    this.status = 201;
    this.body = {data};
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
