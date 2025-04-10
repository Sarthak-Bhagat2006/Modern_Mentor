const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      
    },
    email: {
      type: String,
      required: true,
      unique: true,
     
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
    password: {
      type: String,
      required: function () {
        return !this.linkedin; // If there's no LinkedIn URL, password is required
      }
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

const User = mongoose.model("User", userSchema);
module.exports = User;

// const addUser = async ()=>{
//   let user1 = new User({
//     name: 'Sarthak Bhagat',
//     email: 'bhagatsarthak2132@gmail.com',
//     role: 'Mentor',
//     domain: [ 'ED cell member, IEEE Member' ],
//     linkedin: 'https://www.linkedin.com/in/sarthak-bhagat-8984b9279/',
//     password: 'Sarthak@2132',
//     github: 'https://github.com/Sarthak-Bhagat2006',
//     about: 'I am 2nd year student at PES Modern college of engineering and I passinate about MERN stack development',
//   });

  
//   await user1.save();
 
// }

// addUser();



// const profileSchema = new Schema(
//     {
//       userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
//       linkedinUrl: { type: String, default: "" },
//       githubUrl: { type: String, default: "" },
//       bio: { type: String, default: "" },
//       skills: [{ type: String }],
//     },
//     { timestamps: true }
//   );
  
//   const Profile = mongoose.model("Profile", profileSchema);
  
//   const mentorshipSchema = new Schema(
//     {
//       mentorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//       studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//       status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
//     },
//     { timestamps: true }
//   );

//   const Mentorship = mongoose.model("Mentorship", mentorshipSchema);

//   const groupSchema = new Schema(
//     {
//       groupName: { type: String, required: true },
//       members: [{ type: Schema.Types.ObjectId, ref: "User" }],
//       description: { type: String },
//     },
//     { timestamps: true }
//   );
//   const Group = mongoose.model("Group", groupSchema);
  
  
  // module.exports = { User, Profile, Mentorship, Group };
  


