require('babel/register')({
  // this will override `node_modules` ignoring
  ignore: false
});
const koa = require('koa');
const router = require('koa-router')();
const config = require('./config/config');
const registration = require('./registration/route');
const users = require('./users/route');
const db = require('./database/db');

var app = koa();

router.post('/registration', registration);
router.get('/users', users)
app.use(router.routes())

app.listen(config.port);
console.log('Listening on port ' + config.port);
