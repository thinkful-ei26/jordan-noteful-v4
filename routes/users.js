'use strict';

const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res, next) => {

    User.findOne()
      .sort('asc')
      .then(results => {
        res.json(results);
      })
      .catch(err => {
        next(err);
      });
  });

router.post('/', (req, res, next) => {
    const { fullName, userName, password } = req.body
    const newUser = { fullName, userName, password };
    return User.create(newUser)
    .then (res => {
        res.location(`http://${req.headers.host}/users/${res.userName}`).status(201).json(res)
    }) 
    .catch(err => {
        if (err.code === 11000) {
          err = new Error('User name already exists');
          err.status = 400;
        }
        next(err);
    });
});

module.exports = router;