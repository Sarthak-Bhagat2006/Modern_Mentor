const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, saveRedirectUser } = require("../middleware");


// Signup
router.get("/signup", (req, res) => {
    res.render("users/signup");
})

router.post("/signup", async (req, res) => {
    try {
        const { password } = req.body.user;
        const newUser = new User({

            name: req.body.user.name,
            email: req.body.user.email,
            role: req.body.user.role,
            domain: req.body.user.domain,
            skills: req.body.user.skills,
            linkedin: req.body.user.linkedin,
            github: req.body.user.github,
            profileImage: req.body.user.profileImage,
            about: req.body.user.about,
        });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if ((err)) {
                return next(err)
            }
            req.flash("success", "User Added Succefully");
            res.redirect("/users");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("users/signup");
    }

});


// Login 

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", saveRedirectUser,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
        req.flash("success", "You are logged in now");
        let redirectUrl = res.locals.redirectUrl || '/users';

        res.redirect(redirectUrl);
    });


// Logout    

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged out now");
        res.redirect("/users");
    })
});

module.exports = router;