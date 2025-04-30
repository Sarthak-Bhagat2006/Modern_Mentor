const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, saveRedirectUser } = require("../middleware");
const userController = require("../controllers/users");


// Show all users (excluding current)

router.get("/", isLoggedIn, wrapAsync(userController.allUsers));

// Show all users for public view
router.get("/allusers", isLoggedIn, wrapAsync(userController.publicView));

// Show individual user profile

router.get("/:id", isLoggedIn, wrapAsync(userController.show));

module.exports = router;