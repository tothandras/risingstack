const Robe = require('robe');
const co = require('co');
const config = require('../config/config');

module.exports = {};
module.exports.collection = co(function *() {
  const db = yield Robe.connect(config.mongodb.url);
  const collection = db.collection('users', {
    schema: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
    indexes: [
      // single-field index, unique
      {
        fields: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    ],
  });

  // create the indexes if not already present
  yield collection.ensureIndexes();

  return collection;
});
