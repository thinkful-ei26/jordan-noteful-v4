// const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/user');

// ======= DEFINE & CREATE basicStrategy ========
const localStrategy = new LocalStrategy((username, password, done) => {
    // console.log('local strategy')
    let user;
    User.findOne({ username })
        .then(results => {
            console.log(results)
            user = results;
            if (!results) {
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect username',
                    location: 'username'
                })
        }
        const isValid = user.validatePassword(password);
            if (!isValid) {
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect password',
                    location: 'password'
                });
            }
            return done(null, user);
        })
        .catch(err => {
            // console.log('error')
            if (err.reason === 'LoginError') {
                return done(null, false);
            }
            return done(err);
        });
    });

module.exports = localStrategy;