const config = {};

config.port = process.env.PORT || 3000;

config.jwt = {
  algorithm: 'RS256',
  publicKey: process.env.PUBLIC_KEY || 'app.rsa.pub',
  privateKey: process.env.PRIVATE_KEY || 'app.rsa',
};

config.email = {
  service: process.env.EMAIL_SERVICE,
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
};

config.mongodb = {
  url: process.env.MONGO_URL || '127.0.0.1',
};

module.exports = config;
