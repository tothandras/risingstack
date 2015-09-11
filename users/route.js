const fs = require('fs');
const jwt = require('koa-jwt');
const config = require('../config/config');
const db = require('../database/db');

const publicKey = fs.readFileSync(config.jwt.publicKey);

module.exports = function *(next) {
  try {
    var user = yield jwt.verify(
      this.request.query.jwt,
      publicKey,
      {algorithm: config.jwt.algorithm}
    );
   } catch(e) {
     this.throw(401, 'Invalid token');
   }

   const collection = yield db.collection;

   const registeredUser = yield collection.findOne({
     email: user.email
   });
   if (!registeredUser || publicKey !== registeredUser.token) {
     this.throw(401, 'Invalid token');
   }

   const users = yield collection.find();
   const listElements = users.map(u => `<li>${u.name} - ${u.email}</li>`);
   this.body = '<ul>';
   this.body += listElements.join('\n');
   this.body += '</ul>';

   yield next;
};
