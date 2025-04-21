const express = require("express");
const router = express.Router({mergeParams:true}); 
const {userSchema , groupSchema} = require("../schema");
const Group = require("../models/group");
const User = require("../models/user");
const Notification = require("../models/notification");
const {isLoggedIn,isOwner, isAuthor} = require("../middleware");
const sendNotification = require("../notification");




router.get("/allusers", isLoggedIn, async (req, res) => {
    
  let allUsers = await User.find({ _id: { $ne: req.user._id } });
    const selectedMembers = req.session.selectedMembers || [];
    req.flash("success","Send the request to members to join ")
    res.render("users/indexall", { allUsers, selectedMembers });
  });


router.post("/allusers", isLoggedIn, async (req, res) => {
    const user = req.body.memberId;
    
  const adminId = req.user._id;

  
  const student = await User.findById(user);

  // Create notification for the student
  await sendNotification({
    reciver : student._id,
    sender: adminId,
    message: `You've been invited to join the group by ${req.user.name}.`,
 
  });

  
    if (!req.session.selectedMembers) {
      req.session.selectedMembers = [];
    }
  
    if (!req.session.selectedMembers.includes(user)) {
      req.session.selectedMembers.push(user);
    }
  
    console.log("Selected Member IDs in Session:", req.session.selectedMembers);
    req.flash("success", "Request sent");
    res.redirect("/allusers");
  });
  router.get("/create-group" ,isLoggedIn,async (req,res)=> {
    
    res.render("groups/form");
});



router.get("/notifications",isLoggedIn, async (req, res) => {
  const notifications = await Notification.find({ reciver: req.user._id })
    .populate("sender", "name")
    
    .sort({ createdAt: -1 });

  res.render("notifications/index", { notifications });
});
  router.post("/create-group", isLoggedIn, async (req, res) => {
    const { groupName, description } = req.body;
  
    const newGroup = new Group({
      groupName,
      description,
      groupAdmin: req.user._id,
      members: req.session.selectedMembers || [] // if you want to add selected members
    });
  
    await newGroup.save();
    console.log("New group created:", newGroup);
  
    // Clear the session selection after group is created
    req.session.selectedMembers = [];
  
    req.flash("success", "Group created successfully!");
    res.redirect("/groups"); // or anywhere else
  });

  router.get("/groups",async (req,res)=>{
    let allGroups =await Group.find({}).populate("groupAdmin","name").populate("members","name");
    res.render("groups/index",{ allGroups});
  });

router.get("/groups/show/:id",async (req,res)=>{
    let {id} = req.params;
    let group = await Group.findById(id).populate("Mentors").populate("members").populate("admin","name");
    
    res.render("groups/show",{ group });
});




module.exports = router;
