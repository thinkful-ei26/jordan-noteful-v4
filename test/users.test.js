'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_MONGODB_URI } = require('../config');

const User = require('../models/user');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Noteful API - Users', function () {
//   const id = '0000000000008';
  const username = 'jojo';
  const password = 'BETTY-BOOP';
  const fullname = 'Jordan Haddadi';

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true, useCreateIndex : true })
      .then(() => User.deleteMany());
  });

  beforeEach(function () {
    return User.createIndexes();
  });

  afterEach(function () {
    return User.deleteMany();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('POST /api/users', function () {

    it('Should create a new user', function () {
      return chai
        .request(app)
        .post('/api/users')
        .send({ username, password, fullname })
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('username', 'fullname');
        //   expect(res.body.id).to.exist;
          expect(res.body.username).to.equal(username);
          expect(res.body.fullname).to.equal(fullname);
          return User.findOne({ username });
        })
        .then(user => {
          expect(user).to.exist;
        //   expect(user.id).to.equal(res.body.id);
          expect(user.fullname).to.equal(fullname);
          return user.validatePassword(password);
        })
        .then(isValid => {
          expect(isValid).to.be.true;
        });
    });

    it('Should reject users with missing username', function(){
            return chai
              .request(app)
              .post('/api/users')
              .send({ password, fullname })
              .then(() =>
              expect.fail(null, null, 'Request should not succeed')
            )
            .catch(err => {
              if (err instanceof chai.AssertionError) {
                throw err;
              }
  
              const res = err.response;
              expect(res).to.have.status(422);
              expect(res.body.reason).to.equal('ValidationError');
              expect(res.body.message).to.equal('Missing field');
              expect(res.body.location).to.equal('username');
            });
    });

    it('Should reject users with missing password', function(){
        return chai
            .request(app)
            .post('/api/users')
            .send({ username, fullname })
            .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
    });
    it('Should reject users with non-string username', function(){
        return chai
            .request(app)
            .post('/api/users')
            .send({ username: '', password, fullname })
            .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
    });
    it('Should reject users with non-string password', function(){
        return chai
            .request(app)
            .post('/api/users')
            .send({ username, password: Number, fullname })
            .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
    });
    it('Should reject users with non-trimmed username', function(){
        return chai
            .request(app)
            .post('/api/users')
            .send({ username: ` ${username} `, password, fullname })
            .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
    });
    it('Should reject users with non-trimmed password', function(){
        return chai
            .request(app)
            .post('/api/users')
            .send({ username, password: ` ${password} `, fullname })
            .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
    });
    it('Should reject users with empty username', function(){
        return chai
            .request(app)
            .post('/api/users')
            .send({ username: " ", password, fullname })
            .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
    });
    it('Should reject users with password less than 8 characters', function(){
        return chai
            .request(app)
            .post('/api/users')
            .send({ username, password: password.length < 8, fullname })
            .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
    });
    it('Should reject users with password greater than 72 characters', function(){
        return chai
            .request(app)
            .post('/api/users')
            .send({ username, password: password.length > 72, fullname })
            .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
    });
    it('Should reject users with duplicate username', function(){
        return User.create({ username, password, fullname })
            .then(() =>
            chai.request(app).post('/api/users').send({
                username,
                password,
                fullname
            })
            )
            .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          })
    });
    it('Should trim fullname', function(){
        return chai
            .request(app)
            .post('/api/users')
            .send({ username: username, password, fullname })
            .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
    });

  });

});