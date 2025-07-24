import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  domain: [{ type: String }],
  skills: [{ type: String }],
  linkedin: {
    type: String,
    default: ""
  },
  profilePic: {
    type: String,
    default: "",
  },
  github: {
    type: String,
    default: ""
  },
  about: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 👉 Use email as the username
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  usernameUnique: false
});

const User = model("User", userSchema);

export default User;