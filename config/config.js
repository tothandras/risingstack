var config = {};

config.port = process.env.PORT || 3000;

config.jwt = {};
config.jwt.algorithm = 'RS256';
config.jwt.publicKey = process.env.PUBLIC_KEY || 'app.rsa.pub';
config.jwt.privateKey = process.env.PRIVATE_KEY || 'app.rsa';

config.email = {}
config.email.service = process.env.EMAIL_SERVICE;
config.email.user = process.env.EMAIL_USER;
config.email.password = process.env.EMAIL_PASSWORD;

module.exports = config;
