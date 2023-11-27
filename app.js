const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./src/models/User");

const websiteRoutes = require("./src/routes/Website.routes");
const authRoutes = require("./src/routes/Auth.routes");
const requestRoutes = require("./src/routes/Request.routes");

const app = express();
const port = 3000;

const mongoose = require("mongoose");
const db = mongoose.connection;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const MONGO_URI = "mongodb://127.0.0.1:27017/mini-ho";
mongoose.connect(MONGO_URI);

// Tangani event kesalahan koneksi
db.on("error", (err) => {
  console.error("Koneksi MongoDB gagal:", err);
});

// Tangani event koneksi berhasil
db.once("open", () => {
  console.log("Terhubung ke MongoDB");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const foundUser = await User.findOne({ username });
      if (!foundUser) {
        return done(null, false, { message: "Username tidak ditemukan" });
      }

      const match = await bcrypt.compareSync(password, foundUser.password);

      if (!match) {
        return done(null, false, { message: "Password salah" });
      }

      return done(null, foundUser);
    } catch (error) {
      return done(null, false, { message: error });
    }
  })
);

app.use("/", websiteRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/request", requestRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
