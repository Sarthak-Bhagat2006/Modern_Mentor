import express from 'express';
const router = express.Router({ mergeParams: true });


import { isLoggedIn, isAdmin, isMember } from '../middleware.js';
import sendNotification from '../notification.js';
import wrapAsync from '../utils/wrapAsync.js';
import ExpressError from '../utils/ExpressError.js';

import * as groupsController from '../controllers/groups.controller.js';

// Render All Users
router.get("/allusers", isLoggedIn, wrapAsync(groupsController.allusers));

// Add Request to Users
router.post("/allusers", isLoggedIn, wrapAsync(groupsController.allRequest));

// Render Group Creation Form
router.get("/create-group", isLoggedIn, groupsController.groupFormRender);

// Create Group and Send Notifications
router.post("/create-group", isLoggedIn, wrapAsync(groupsController.groupCreate));

// Notifications
router.get("/notifications", isLoggedIn, wrapAsync(groupsController.notifications));

// View All Groups
router.get("/", wrapAsync(groupsController.allGroup));

// View Single Group
router.get("/show/:id", isMember, wrapAsync(groupsController.showGroup));

// Accept Group Request
router.post("/accept", isLoggedIn, wrapAsync(groupsController.requestAccept));

// Delete Group
router.post("/delete/:id", isLoggedIn, isAdmin, wrapAsync(groupsController.deleteGroup));

export default router;