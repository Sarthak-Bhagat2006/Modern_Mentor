

const express = require("express");
const router = express.Router({ mergeParams: true });

const { groupSchema, userSchema } = require("../schema");
const Group = require("../models/group");
const User = require("../models/user");
const Notification = require("../models/notification");

const { isLoggedIn, isOwner, isAuthor } = require("../middleware");
const sendNotification = require("../notification");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

const groupsController = require("../controllers/groups");


// Render All Users

router.get("/allusers", isLoggedIn, wrapAsync(groupsController.allusers));


// Add Request to Users

router.post("/allusers", isLoggedIn, wrapAsync(groupsController.allRequest));


// Render Group Creation Form

router.get("/create-group", isLoggedIn, (groupsController.groupFormRender));


// Create Group and Send Notifications

router.post("/create-group", isLoggedIn, wrapAsync(groupsController.groupCreate));


// Notifications

router.get("/notifications", isLoggedIn, wrapAsync(groupsController.notifications));


// View All Groups

router.get("/", wrapAsync(groupsController.allGroup));


// View Single Group

router.get("/show/:id", wrapAsync(groupsController.showGroup));


// Accept Group Request

router.post("/accept", isLoggedIn, wrapAsync(groupsController.requestAccept));

module.exports = router;