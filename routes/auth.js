const options = {session: false, failWithError: true};
const passport = require('passport');
const express = require('express');
const localAuth = passport.authenticate('local', options);
const dotenv = require('dotenv');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');
const jwt = require('jsonwebtoken');


const router = express.Router();

function createAuthToken(user) {
    console.log('signing', user)
    return jwt.sign({ user }, JWT_SECRET, {
        subject: user.username,
        expiresIn: JWT_EXPIRY
    });
}
const jwtAuth = passport.authenticate('jwt', {session: false, failWithError: true});

router.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({ authToken });
});

router.post('/login', localAuth, function (req, res) {
    const authToken = createAuthToken(req.user);
    // console.log('Post on login')
    return res.json({ authToken });
});

module.exports = router;