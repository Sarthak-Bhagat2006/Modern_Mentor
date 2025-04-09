const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const Group = require("./models/group");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate')
const session = require("express-session");
require("dotenv").config();
const passport = require("passport");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());

  const authRoutes = require("./routes/auth");
  app.use("/auth", authRoutes);

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

//Users Route

app.get("/users",async (req,res)=>{
    const allUsers = await User.find({});
    
    res.render("users/index",{allUsers});
});

//signUp or create route

app.get("/users/new",(req,res)=>{
    res.render("users/new");
})

app.post("/users",async (req,res)=>{
    const newUser = new User(req.body.user);
    await newUser.save();
    res.redirect("/users")
})

//Login Authentication
app.get("users/login",(req,res)=>{
    res.render("users/login");
})
app.post("/users", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user)
        return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });
  
      const token = jwt.sign(
        { id: user._id, name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          domain: user.domain
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", err });
    }
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
