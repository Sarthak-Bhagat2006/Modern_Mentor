const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");

const Notification = require("./models/notification")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const session = require("express-session")
const flash = require("connect-flash");

const ExpressError = require("./utils/ExpressError");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const groupRoutes = require("./routes/groups");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { isLoggedIn } = require("./middleware");


main()
  .then(() => {
    console.log("connected to DB")
  })
  .catch((err) => {
    console.log("err")
  });
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ModernMentor');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("This is index route");
})

app.use(session({
  secret: 'mySuperSecretCode',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
})
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
})
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
})


//Checking for isNotified and store in Local
app.use(async (req, res, next) => {
  res.locals.isNotified = false; // default to false

  if (req.user) {
    try {
      const notification = await Notification.exists({ reciver: req.user._id });
      if (notification) {
        res.locals.isNotified = true;
      }
    } catch (err) {
      console.error("Error checking notifications:", err);
      res.locals.isNotified = false;
    }
  }

  next();
});


app.use("/", authRoutes);
app.use("/users", userRoutes);
app.use("/groups", groupRoutes);


app.get("/community", isLoggedIn, (req, res) => {
  res.render("users/community");
});


app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error handler middleware 
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.render("error.ejs", { statusCode, message })
  // res.status(statusCode).send(message);
});



app.listen(8080, () => {
  console.log("Server is Listing to port 8080");
})
