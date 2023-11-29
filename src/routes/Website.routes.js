const express = require('express');
const router = express.Router();
const { authenticated } = require('../utils/authentication');

router.get('/', authenticated, (req, res) => {
  res.render('pages/index', { user: res.locals.currentUser });
});

router.get('/add', authenticated, (req, res) => {
  res.render('pages/add', { user: res.locals.currentUser });
});

router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('pages/register');
});

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('pages/login');
});

module.exports = router;
