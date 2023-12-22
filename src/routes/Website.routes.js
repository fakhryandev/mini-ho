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
  res.render('pages/user/', { user: 'HARDCODE' })
})

router.get('/user/add', (req, res) => {
  res.render('pages/user/add', { user: 'HARDCODE' })
})

router.get('/user/edit/:username', (req, res) => {
  res.render('pages/user/edit', { user: 'HARDCODE' })
})

router.get('/part', authenticated, (req, res) => {
  res.render('pages/part/', { user: res.locals.currentUser })
})

router.get('/type', authenticated, (req, res) => {
  res.render('pages/type/', { user: res.locals.currentUser })
})

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('pages/login');
});

module.exports = router;
