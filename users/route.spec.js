const chai = require('chai');
const supertest = require('supertest');
const co = require('co');

chai.should();

describe('/users route', () => {
  let db;
  let app;
  let route;
  let request;

  let name;
  let email;
  let token;

  before((done) => {
    co(function *() {
      name = 'Foo Bar';
      email = 'foo@bar.com';
      token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJuYW1lIjoiRm9vIEJhci
        IsImVtYWlsIjoiZm9vQGJhci5jb20iLCJpYXQiOjE0NDIxMzY4ODZ9.U8lHfVa5E_EC9FBYh
        2yHspTeWO3SYlxD7qH6hhzWS9Sjwccbh_s_J4TT2Ol1z0jtV6y4xkrWNZGRI4GqWLuQqFl0O
        rw_Yg69_0HtDZ4lgS6kLLRCXlg6WAstVpSY1-R0s6s1GTVu-4deowx-ZaizWIVABHfk_HCnC
        YT47K0W8PA`;

      console.log('start requires');
      db = require('../database/db');
      app = require('../app');
      route = require('./route');
      console.log('finish require');
      request = supertest.agent(app.listen());

      const collection = yield db.collection;
      yield collection.insert({name, email, token});
    }).then(done);
  });

  it('should export a route handler generator', () => {
    route.should.be.a('function');
    route.constructor.name.should.be.equal('GeneratorFunction');
  });

  it('should reject the request if the jwt token is missing', (done) => {
    request.get('/users')
      .expect(401)
      .end(function(error) {
        if (error) {
          return done(error);
        }
        done();
      });
  });

  it('should reject the request if the jwt token is invalid', (done) => {
    request.get('/users?jwt=eyJ0eXAiOiJKVgdfij')
      .expect(401)
      .end(function(error) {
        if (error) {
          return done(error);
        }
        done();
      });
  });

  it('should response with all the users if the token is valid', (done) => {
    request.get(`/users?jwt=${token}`)
      .expect(200)
      .end(function(error) {
        if (error) {
          return done(error);
        }
        done();
      });
  });
});
