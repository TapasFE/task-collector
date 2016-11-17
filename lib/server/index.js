const Koa = require('koa');
const BodyParser = require('koa-bodyparser');

const app = Koa();

app
.use(BodyParser())
.use(require('./routes/api'))
.use(require('./routes/static'))

const {PORT=4333, HOST=''} = process.env;
app.listen(PORT, HOST, err => {
  console.log(`Listening at port ${PORT}...`);
});
