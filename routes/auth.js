const options = {session: false, failWithError: true};
const passport = require('passport');
const express = require('express');
const localAuth = passport.authenticate('local', options);

const router = express.Router();

router.post('/login', localAuth, function (req, res) {
    console.log('Post on login')
    return res.json(req.user);
})

module.exports = router;