const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const config = require('../config');

const app = Koa();
app.keys = [new Buffer(config.get('SECRET_KEY').toString())];

app
.use(BodyParser())
.use(require('./routes/account'))
.use(require('./routes/requireAuth'))
.use(require('./routes/api'))
.use(require('./routes/static'))

const HOST = config.get('HOST');
const PORT = config.get('PORT');
app.listen(PORT, HOST, err => {
  console.log(`Listening at port ${PORT}...`);
});
