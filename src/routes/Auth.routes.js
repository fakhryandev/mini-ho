const express = require("express");
const router = express.Router();
const authController = require("../controllers/Auth.controller");
const passport = require("passport");

router.post("/sign-up", authController.signUp);
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureMessage
//   })
// );

module.exports = router;
