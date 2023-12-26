const express = require('express');
const router = express.Router();
const { authenticated } = require('../utils/authentication');

router.get('/', authenticated, (req, res) => {
  res.render('pages/index', { user: res.locals.currentUser });
});

router.get('/add', authenticated, (req, res) => {
  res.render('pages/add', { user: res.locals.currentUser });
});

router.get('/user', authenticated, (req, res) => {
  res.render('pages/user/', { user: res.locals.currentUser });
});

router.get('/user/add', authenticated, (req, res) => {
  res.render('pages/user/add', { user: res.locals.currentUser });
});

router.get('/user/edit/:username', authenticated, (req, res) => {
  res.render('pages/user/edit', { user: res.locals.currentUser });
});

router.get('/part', authenticated, (req, res) => {
  res.render('pages/part/', { user: res.locals.currentUser });
});

router.get('/type', authenticated, (req, res) => {
  res.render('pages/type/', { user: res.locals.currentUser });
});

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('pages/login');
});

module.exports = router;
