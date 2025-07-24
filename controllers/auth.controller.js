import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js'

export const signupController = async (req, res) => {
    try {


        const { password } = req.body.user;

        // 1. Create a new user object WITHOUT the password
        const newUser = new User({
            name: req.body.user.name,
            email: req.body.user.email,
            role: req.body.user.role,
            domain: req.body.user.domain,
            skills: req.body.user.skills,
            linkedin: req.body.user.linkedin,
            github: req.body.user.github,
            profileImage: req.body.user.profileImage,
            about: req.body.user.about
        });

        // 2. Register the user with the provided password
        //    ✅ This uses passport-local-mongoose internally
        //    ✅ It automatically:
        //       - Generates a salt
        //       - Hashes the password with bcrypt
        //       - Adds 'hash' and 'salt' fields to the user document
        //       - Saves the user in MongoDB
        const registeredUser = await User.register(newUser, password);

        // 3. Automatically log the user in after registration
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "User Added Successfully");
            res.redirect("/users");
        });

    } catch (e) {
        // 4. Handle validation or registration errors
        req.flash("error", e.message);
        res.redirect("/users/signup");
    }
}

export const loginController = (req, res) => {
    req.flash("success", "You are logged in now");

    // Redirect to originally intended page (if any), or default
    const redirectUrl = res.locals.redirectUrl || '/users';
    res.redirect(redirectUrl);
}

export const logoutController = (req, res, next) => {
    //req.logout() is a method provided by Passport.js when you’re using session-based authentication (not JWT). It logs the user out by terminating the login session.

    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out now");
        res.redirect("/users/login");
    });
};

export const updateProfileController = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            req.flash("error", "Profile picture is required!");
            return res.redirect("/update-profile");
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        req.flash("success", "Profile updated successfully!");
        res.redirect("/profile"); // or wherever your profile view is
    } catch (err) {
        console.error("Error updating profile:", err);
        req.flash("error", "Something went wrong while updating your profile.");
        res.redirect("/update-profile");
    }
};