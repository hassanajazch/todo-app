const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const uuidv1 = require('uuid/v1');
const userStore = require('../models/User');


// load user model
require('../models/User');
const User = mongoose.model('users');


// user login route
router.get('/login', (req,res) => {
  res.render('users/login');
});

// user login route
router.get('/register', (req,res) => {
  res.render('users/register');
});


// login form post
router.post('/login', (req,res,next) => {
  passport.authenticate('local', {
    successRedirect: '/todos',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req,res,next);
});

// register form post
router.post('/register', (req,res) => {
  userStore.add(req.body).then(result => {
    if(result.errors) {
      res.render('users/register', result)
    }
    if(result.emailerror) {
      req.flash('error_msg', 'A user with the same email already exists');
      res.redirect('/users/register');
    } else {
      req.flash('success_msg', 'You are now registered and can login');
      res.redirect('/users/login');
    }
  }, (err) => {
    req.flash('success_msg', err);
    res.redirect('/users/login');
  });
});

router.get('/logout', (req,res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
