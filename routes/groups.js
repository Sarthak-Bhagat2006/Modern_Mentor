const express = require("express");
const router = express.Router({ mergeParams: true });
const { userSchema, groupSchema } = require("../schema");
const Group = require("../models/group");
const User = require("../models/user");
const Notification = require("../models/notification");
const { isLoggedIn, isOwner, isAuthor } = require("../middleware");
const sendNotification = require("../notification");



//Render All the users
router.get("/allusers", isLoggedIn, async (req, res) => {

  let allUsers = await User.find({ _id: { $ne: req.user._id } });
  const selectedMembers = req.session.selectedMembers || [];
  req.flash("success", "Send the request to members to join ")
  res.render("users/indexall", { allUsers, selectedMembers });
});

// add request to users
router.post("/allusers", isLoggedIn, async (req, res) => {
  let user = req.body.memberId;

  // Ensure selectedMembers is an array before using
  if (!Array.isArray(req.session.selectedMembers)) { //check that it is not array 
    req.session.selectedMembers = [];
  }

  if (!req.session.selectedMembers.includes(user)) {
    req.session.selectedMembers.push(user);
  }
  console.log(req.session.selectedMembers);
  res.redirect("/allusers");
});

//Render Group Form 
router.get("/create-group", isLoggedIn, async (req, res) => {
  res.render("groups/form");
})

//Create group and send notification 
router.post("/create-group", isLoggedIn, async (req, res) => {
  const description = req.body.description;
  const groupName = req.body.groupName;
  req.session.currGroup = groupName

  const adminId = req.user._id;

  const newGroup = new Group({
    groupName,
    description,
    groupAdmin: req.user._id,
    pendingMembers: req.session.selectedMembers || [] // if you want to add selected members
  });



  await newGroup.save();
  console.log("New group created:", newGroup);

  for (let member of req.session.selectedMembers) {
    await sendNotification({
      reciver: member,
      sender: adminId,
      message: `You've been invited to join the group named ${groupName} by ${req.user.name}.`,
      group: newGroup._id

    });

  }
  console.log(newGroup._id)
  // Clear the session selection after group is created
  req.session.selectedMembers = [];

  req.flash("success", "Group created successfully!");
  res.redirect("/groups"); // or anywhere else
});

//Render  Notifications
router.get("/notifications", isLoggedIn, async (req, res) => {
  const notifications = await Notification.find({ reciver: req.user._id })
    .populate("sender", "name")

    .sort({ createdAt: -1 });

  res.render("notifications/index", { notifications });
});


router.get("/groups", async (req, res) => {
  let allGroups = await Group.find({}).populate("groupAdmin", "name").populate("members", "name").populate("pendingMembers", "name");
  res.render("groups/index", { allGroups });
});

router.get("/groups/show/:id", async (req, res) => {
  let { id } = req.params;
  let group = await Group.findById(id).populate("Mentors", "name").populate("members", "name").populate("groupAdmin", "name");

  res.render("groups/show", { group });
});


router.post("/groups/accept", isLoggedIn, async (req, res) => {
  let user = req.user._id;
  let groupId = req.body.group
  await Group.findByIdAndUpdate(groupId, {
    $push: { members: user },       // Add the user to members array
    $pull: { pendingMembers: user } // Remove the user from pendingMembers array
  });
  res.send("User accepted into the group!");
});




module.exports = router;
