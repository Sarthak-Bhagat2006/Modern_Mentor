const Group = require("../models/group");
const User = require("../models/user");
const Notification = require("../models/notification");
const sendNotification = require("../notification");
const { groupSchema, userSchema } = require("../schema");




const { isLoggedIn } = require("../middleware");

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

module.exports.allusers = async (req, res) => {
    const allUsers = await User.find({ _id: { $ne: req.user._id } });
    const selectedMembers = req.session.selectedMembers || [];
    req.flash("success", "Send the request to members to join");
    res.render("users/indexall", { allUsers, selectedMembers });
}

module.exports.allRequest = async (req, res) => {
    const user = req.body.memberId;
    if (!Array.isArray(req.session.selectedMembers)) {
        req.session.selectedMembers = [];
    }
    if (!req.session.selectedMembers.includes(user)) {
        req.session.selectedMembers.push(user);
    }
    console.log(req.session.selectedMembers);
    res.redirect("/groups/allusers");
}

module.exports.groupFormRender = (req, res) => {
    res.render("groups/form");
}
module.exports.groupCreate = async (req, res) => {
    const { groupName, description } = req.body;

    if (!groupName || !description) {
        throw new ExpressError(400, "Send valid data for group creation");
    }

    req.session.currGroup = groupName;

    const selectedMembers = Array.isArray(req.session.selectedMembers)
        ? req.session.selectedMembers
        : [];

    const newGroup = new Group({
        groupName,
        description,
        groupAdmin: req.user._id,
        pendingMembers: selectedMembers,
    });

    await newGroup.save();

    for (let member of selectedMembers) {
        await sendNotification({
            reciver: member,
            sender: req.user._id,
            message: `You've been invited to join the group named ${groupName} by ${req.user.name}.`,
            group: newGroup._id
        });
    }

    req.session.selectedMembers = []; // Clear selection
    req.flash("success", "Group created successfully!");
    res.redirect("/groups");
};
module.exports.notifications = async (req, res) => {
    const notifications = await Notification.find({ reciver: req.user._id })
        .populate("sender", "name")
        .sort({ createdAt: -1 });

    res.render("notifications/index", { notifications });
}
module.exports.allGroup = async (req, res) => {
    const allGroups = await Group.find({})
        .populate("groupAdmin", "name")
        .populate("members", "name")
        .populate("pendingMembers", "name");

    res.render("groups/index", { allGroups });
}

module.exports.showGroup = async (req, res) => {
    const { id } = req.params;
    const group = await Group.findById(id)
        .populate("Mentors", "name")
        .populate("members", "name")
        .populate("groupAdmin", "name");

    res.render("groups/show", { group });
}

module.exports.requestAccept = async (req, res) => {
    const user = req.user._id;
    const groupId = req.body.group;

    if (!user || !groupId) {
        throw new ExpressError(400, "Send valid data");
    }

    await Group.findByIdAndUpdate(groupId, {
        $push: { members: user },
        $pull: { pendingMembers: user }
    });

    res.send("User accepted into the group!");
}

