const express = require("express");
const router = express.Router({mergeParams:true}); 
const {userSchema , groupSchema} = require("../schema");
const Group = require("../models/group");
const User = require("../models/group");
const {isLoggedIn,isOwner, isAuthor} = require("../middleware")


router.get("/groups" ,isLoggedIn,async (req,res)=> {
    let allGroups = await Group.find({})
    res.render("groups/index",{ allGroups });
})

module.exports = router;
