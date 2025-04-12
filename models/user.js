const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema(
  {

    email: {
      type: String,
      required: true,
      unique: true,
     
    },
    name: {
      type: String,
      required: true,
      
     
    },
    
    role: {
      type: String,
       
      required: true,
    },
    domain: [{ type: String }],
    skills: [{ type: String }],
    linkedin: {
      type: String,
      default: ""
    },
    profileImage: String,
    github: {
      type: String,
      default: ""
    },
    about: {
      type:String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  
);
userSchema.plugin(passportLocalMongoose,{ usernameField: 'email',
  usernameUnique: false});

const User = mongoose.model("User", userSchema);
module.exports = User;

