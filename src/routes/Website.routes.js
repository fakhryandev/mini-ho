const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index');
});

router.get('/add', (req, res) => {
  res.render('pages/add');
});

router.get('/register', (req, res) => {
  res.render('pages/register');
});

router.get('/login', (req, res) => {
  res.render('pages/login');
});

module.exports = router;
