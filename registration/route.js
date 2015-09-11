const fs = require('fs');
const jwt = require('koa-jwt');
const nodemailer = require('nodemailer');
const parse = require('co-body');
const config = require('../config/config');
const db = require('../database/db');

module.exports = function *(next) {
  const privateKey = fs.readFileSync(config.jwt.privateKey);
  const user = yield parse(this);

  // ensure required fields
  if (!user.name) {
    this.throw(400, '.name is required');
  }
  if (!user.email) {
    this.throw(400, '.email is required');
  }

  // create a jwt token
  const claims = {
    name: user.name,
    email: user.email,
  };
  const token = jwt.sign(claims, privateKey, {
    algorithm: config.jwt.algorithm,
  });

  // send an email including a link to /users
  let mailConfig;
  if (config.email.service && config.email.user && config.email.password) {
    mailConfig = {
      service: config.email.service,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    };
  }
  const transporter = nodemailer.createTransport(mailConfig);
  try {
    // wrap the callback-based API
    yield new Promise((resolve, reject) => {
      transporter.sendMail({
        from: 'noreply@risingstack.com',
        to: user.email,
        subject: 'User list',
        html:
          `<p>
            Hi ${user.name},
            check out all the <a href="${this.protocol}://${this.host}/users?jwt=${token}">users</a>!
          </p>`,
      }, (error, info) => {
        if (error) {
          return reject(error);
        }
        resolve(info);
      });
    });
  } catch (error) {
    console.log(error);
    this.throw(400, `Failed to send email to ${user.email}`);
  }

  const collection = yield db.collection;
  try {
    // insert the new user into the database
    yield collection.insert({
      token,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    this.throw(400, `A user with email address ${user.email} is already registered`);
  }

  this.status = 200;
  yield next;
};
