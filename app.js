const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const Group = require("./models/group");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const session = require("express-session")
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

main()
 .then(()=>{
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
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res) =>{
    res.send("This is index route");
})

app.use(session({
  secret: 'mySuperSecretCode',
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:  7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
} 
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  next();
})
app.use((req,res,next)=>{
  res.locals.error = req.flash("error");
  next();
})


//Users Route

app.get("/users",async (req,res)=>{
    const allUsers = await User.find({});
    
    res.render("users/index",{allUsers});
});

//signUp or create route

app.get("/signup",(req,res)=>{
    res.render("users/signup");
})

app.post("/users",async (req,res)=>{
  try{
    const {password} = req.body.user;
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
    await User.register(newUser,password);
    req.flash("Success","User Added Succefully");
    res.redirect("/users")
  }catch(e){
    req.flash("error",e.message);
    res.redirect("users/signup");
  }
  
});

// Login 

app.get("/login", (req,res)=>{
  res.render("users/login");
});

app.post("/login",
  passport.authenticate('local',{ failureRedirect: '/login',failureFlash: true }),
  async(req,res)=>{
    res.send("Welcome to ModernMentor")
});

  
  

  //show route

app.get("/users/:id", async(req,res)=>{
    let {id} = req.params;
    let user = await User.findById(id);
    
    res.render("users/show",{ user });
});

app.listen(8080,() =>{
    console.log("Server is Listing to port 8080");
})
