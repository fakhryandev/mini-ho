const authenticated = (req, res, next) => {
  req.isAuthenticated() ? next() : res.redirect('/login');
};

module.exports = { authenticated };
