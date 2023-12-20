const express = require('express');
const router = express.Router();
const { authenticated } = require('../utils/authentication');

router.get('/', authenticated, (req, res) => {
  res.render('pages/index', { user: res.locals.currentUser });
});

router.get('/add', authenticated, (req, res) => {
  res.render('pages/add', { user: res.locals.currentUser });
});

router.get('/user', (req, res) => {
  res.render('pages/user/', { user: {username: 'HARDCODE'} })
})

router.get('/user/add', (req, res) => {
  res.render('pages/user/add', { user: {username: 'HARDCODE'} })
})

router.get('/user/edit', (req, res) => {
  res.render('pages/user/edit', { user: {username: 'HARDCODE'} })
})

router.get('/part', (req, res) => {
  res.render('pages/part/', { user: {username: 'HARDCODE'} })
})

router.get('/type', (req, res) => {
  res.render('pages/type/', { user: {username: 'HARDCODE'} })
})

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('pages/login');
});

module.exports = router;
