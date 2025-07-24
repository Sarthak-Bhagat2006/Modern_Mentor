import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";
import { connectDB } from './lib/db.js';
import path from 'path';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import User from './models/user.model.js';
import Notification from './models/notification.model.js';
import ExpressError from './utils/ExpressError.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/users.route.js';
import groupRoutes from './routes/groups.route.js';
import messageRoutes from './routes/messages.route.js';
import { isLoggedIn } from './middleware.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { connect } from 'http2';

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173", // React frontend
  credentials: true,               // Allow session cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};



const app = express();

app.use(cors(corsOptions));

// __dirname workaround in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- DB Connection ---


// --- View Engine and Middleware ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);


app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// --- Passport Setup ---
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- Global Locals Middleware ---

//res.locals.currUser is available in views only, not in other JS files like routes or controllers directly.
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// --- Notification Middleware ---
app.use(async (req, res, next) => {
  res.locals.isNotified = false;

  if (req.user) {
    try {
      const notification = await Notification.exists({ reciver: req.user._id });
      res.locals.isNotified = !!notification;
    } catch (err) {
      console.error("Error checking notifications:", err);
    }
  }

  next();
});

// -
app.use("/", authRoutes);
app.use("/users", userRoutes);
app.use("/groups", groupRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/community", isLoggedIn, (req, res) => {
  res.render("users/community");
});

// --- 404 Handler ---
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error Handler 
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
});

//  Start Server 
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
  connectDB();
});