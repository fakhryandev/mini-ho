function checkAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.isAdmin) {
    return next();
  }

  res.status(403).send('Akses ditolak, anda bukan admin.');
}

module.exports = { checkAdmin };

