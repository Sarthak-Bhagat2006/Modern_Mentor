const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require("../models/user");

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ["r_liteprofile"], // ✅ Removed r_emailaddress
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("LinkedIn profile:", profile); 
        // Since r_emailaddress is removed, don't try to access it
        const email = profile.id + "@linkedin.com"; // 👈 Fake email placeholder
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          name: profile.displayName,
          email,
          linkedin: profile.publicProfileUrl || profile._json.vanityName || "",
          profileImage: profile.photos?.[0]?.value || "",
          password: "linkedin", // This is a placeholder
          role: "Student",
        });

        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Required for session support
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});