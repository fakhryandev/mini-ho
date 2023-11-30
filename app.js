const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./src/models/User');
require('dotenv').config();

const websiteRoutes = require('./src/routes/Website.routes');
const authRoutes = require('./src/routes/Auth.routes');
const requestRoutes = require('./src/routes/Request.routes');

const app = express();
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
const session = require('express-session');
const db = mongoose.connection;

const requestController = require('./src/controllers/Request.controller');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI);

// Tangani event kesalahan koneksi
db.on('error', (err) => {
  console.error('Koneksi MongoDB gagal:', err);
});

// Tangani event koneksi berhasil
db.once('open', () => {
  console.log('Terhubung ke MongoDB');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const foundUser = await User.findOne({ username });
      if (!foundUser) {
        return done(null, false, { message: 'Username tidak ditemukan' });
      }

      const match = await bcrypt.compareSync(password, foundUser.password);

      if (!match) {
        return done(null, false, { message: 'Password salah' });
      }

      return done(null, foundUser);
    } catch (error) {
      return done(null, false, { message: error });
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', websiteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/request', requestRoutes);

app.get('/photos/:urlphoto', requestController.getPhotos);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
