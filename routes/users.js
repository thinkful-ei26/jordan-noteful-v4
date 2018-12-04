'use strict';

const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res, next) => {

    User.find()
      .sort('asc')
      .then(results => {
        res.json(results);
      })
      .catch(err => {
        next(err);
      });
  });

router.post('/', (req, res, next) => {
    const { fullname, username, password } = req.body
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
      const err = new Error(`Missing '${missingField}' in request body`);
      err.status = 422;
      return next(err);
    }

    const stringFields = ['username', 'password', 'fullName'];
    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string');

    if (nonStringField) {
      return res.status(422).json({
          code: 422,
          reason: 'ValidationError',
          message: 'Incorrect field type: expected string',
          location: nonStringField
      });
    }

    const trimmedFields = ['username', 'password']
    const nonTrimmedField = trimmedFields.find(field => req.body[field].trim() !== req.body[field]);

    if (nonTrimmedField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedField
        })
      }

    const sizedFields = {
        username: {
            min: 1
        },
        password: {
            min: 8,
            max: 72
        }
    };

    const tooSmallField = Object.keys(sizedFields).find(
        field => 'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min);
    const tooLargeField = Object.keys(sizedFields).find(
        field => 'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max);

    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'Validationerror',
            message: tooSmallField 
            ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
            : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }

    return User.hashPassword(password)
        .then(digest => {
            const newUser = {
                username,
                password: digest,
                fullname
    };
    console.log(newUser);
    return User.create(newUser);
  })
  .then(result => {
    return res.status(201).location(`/api/users/${result.id}`).json(result.serialize());
  })
  .catch(err => {
    if (err.code === 11000) {
      err = new Error('The username already exists');
      err.status = 400;
    }
    next(err);
  });
});

router.delete('/:id', function (req,res,next) 
    { const id = req.params.id; 
    return User.findByIdAndDelete(id) 
    .then(() => res.sendStatus(204)); 
});

module.exports = router;