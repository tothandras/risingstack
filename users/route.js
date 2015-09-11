const fs = require('fs');
const jwt = require('koa-jwt');
const config = require('../config/config');
const db = require('../database/db');

const publicKey = fs.readFileSync(config.jwt.publicKey);

module.exports = function *(next) {
  // verify token
  const token = this.request.query.jwt;
  let user;
  try {
    user = yield jwt.verify(token, publicKey, {
      algorithm: config.jwt.algorithm,
    });
  } catch (error) {
    console.log(error);
    this.throw(401, 'Invalid token');
  }

  const collection = yield db.collection;
  const registeredUser = yield collection.findOne({
    email: user.email,
  });
  if (!registeredUser) {
    const error = `No user is registered with email address ${user.email}`;
    console.log(error);
    this.throw(401, error);
  }
  if (token !== registeredUser.token) {
    const error = 'Invalid token';
    console.log(error);
    this.throw(401, error);
  }

  // create the list of users
  const users = yield collection.find();
  const listElements = users.map(u => `<li>${u.name} - ${u.email}</li>`);
  this.body = '<ul>';
  this.body += listElements.join('');
  this.body += '</ul>';

  this.status = 200;
  yield next;
};
