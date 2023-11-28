const express = require('express');
const router = express.Router();
const authController = require('../controllers/Auth.controller');
const passport = require('passport');

router.post('/sign-up', authController.signUp);
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: 'Login successful' });
    });
  })(req, res, next);
});

module.exports = router;
