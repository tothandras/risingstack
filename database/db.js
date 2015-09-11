const Robe = require('robe');
const co = require('co');

module.exports = {};
module.exports.collection = co(function*() {
  var db = yield Robe.connect('127.0.0.1');
  var collection = db.collection('users', {
    schema: {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    },
    indexes: [
     // single-field index, unique
     {
       fields: {
         email: 1
       },
       options: {
         unique: true
       }
     }
   ]
  });

  // Create the indexes if not already present. Throws Error if it fails.
  yield collection.ensureIndexes();

  return collection;
});
