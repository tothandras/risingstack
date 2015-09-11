const fs = require('fs');
const jwt = require('koa-jwt');
const nodemailer = require('nodemailer');
const parse = require('co-body');
const config = require('../config/config');
const db = require('../database/db');

const privateKey = fs.readFileSync(config.jwt.privateKey);

module.exports = function *(next) {
  var user = yield parse(this);
  if (!user.name) {
    this.throw(400, '.name is required');
  }
  if (!user.email) {
    this.throw(400, '.email is required');
  }

  var claims = {
      name: user.name,
      email: user.email
  };
  var token = jwt.sign(claims, privateKey, {algorithm: config.jwt.algorithm});

  var mailConfig;
  var sender = 'noreply@risingstack.com';
  if (config.email.service && config.email.user && config.email.password) {
    sender = config.email.user;
    mailConfig = {
      service: config.email.service,
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    };
  }

  var transporter = nodemailer.createTransport(mailConfig);
  try {
    yield new Promise((resolve, reject) => {
      transporter.sendMail({
        from: sender,
        to: user.email,
        subject: 'User list',
        html:
          `<p>
            Hi ${user.name},
            check out all the <a href="${this.protocol}://${this.host}/users?jwt=${token}">users</a>!
          </p>`
      }, (error, info) => {
        if (error) {
          return reject(error);
        }
        resolve(info)
      });
    });
  } catch (error) {
    this.throw(400, error);
  }

  var collection = yield db.collection;
  try {
    var item = yield collection.insert({
      token,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    this.throw(400, `Email address (${user.email}) is already registered`);
  }

  this.status = 200;
  yield next;
};
