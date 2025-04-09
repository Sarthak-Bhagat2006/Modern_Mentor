const express = require("express");
const passport = require("passport");
const router = express.Router();

// Start LinkedIn login
router.get("/linkedin", passport.authenticate("linkedin"));

// Handle callback
router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

module.exports = router;