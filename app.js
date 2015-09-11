// babel register
require('./common/babel-register');

const koa = require('koa');
const router = require('koa-router')();
const config = require('./config/config');
const registration = require('./registration/route');
const users = require('./users/route');

const app = koa();
module.exports = app;

router.post('/registration', registration);
router.get('/users', users);
app.use(router.routes());

// start app
if (!module.parent) {
  app.listen(config.port);
  console.log('Listening on port ' + config.port);
}
