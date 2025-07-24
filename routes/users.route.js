import express from 'express';
import passport from 'passport';


import wrapAsync from '../utils/wrapAsync.js';
import ExpressError from '../utils/ExpressError.js';
import { isLoggedIn, saveRedirectUser } from '../middleware.js';
import * as userController from '../controllers/users.controller.js';

const router = express.Router({ mergeParams: true });

// Show all users (excluding current)
router.get("/", isLoggedIn, wrapAsync(userController.allUsers));

router.get("/me", isLoggedIn, (req, res) => {
    res.json({ currUser: req.user });
});

// Show all users for public view
router.get("/allusers", isLoggedIn, wrapAsync(userController.publicView));

// Show individual user profile
router.get("/:id", isLoggedIn, wrapAsync(userController.show));

export default router;