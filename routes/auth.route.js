import express from 'express';
import passport from 'passport';


import { isLoggedIn, saveRedirectUser } from '../middleware.js';
import * as authController from '../controllers/auth.controller.js';



const router = express.Router({ mergeParams: true });

// Signup
router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/signup", authController.signupController);


// Login


router.get("/login", (req, res) => {
    res.render("users/login");
});


router.post(
    "/login",

    // 1. Middleware to store the URL the user originally wanted to access
    saveRedirectUser,

    // 2. Passport middleware to authenticate the user using 'local' strategy
    //    ✅ It automatically:
    //       - Looks up the user by email (configured in your User model)
    //       - Uses the stored 'salt' and 'hash' to verify password
    //       - Attaches the user to req.user on success
    //       - Triggers failureRedirect and failureFlash on failure
    passport.authenticate('local', {
        failureRedirect: '/login',  // Redirect back if login fails
        failureFlash: true          // Show error message if login fails
    }),

    // 3. Final middleware if login succeeds
    authController.loginController
);

// Logout
router.get("/logout", authController.logoutController);

router.get("/update-profile", isLoggedIn, authController.updateProfileController);



export default router;