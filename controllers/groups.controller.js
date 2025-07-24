
import Group from '../models/group.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import sendNotification from '../notification.js';
import { groupSchema, userSchema } from '../schema.js';

import wrapAsync from '../utils/wrapAsync.js';
import ExpressError from '../utils/ExpressError.js';

// --- Controller Functions ---

export async function allusers(req, res) {
    const allUsers = await User.find({ _id: { $ne: req.user._id } });
    const selectedMembers = req.session.selectedMembers || [];
    req.flash("success", "Send the request to members to join");
    res.render("users/indexall", { allUsers, selectedMembers });
}

export async function allRequest(req, res) {
    const memberId = req.body.memberId;

    if (!memberId) {
        req.flash("error", "Invalid member selected.");
        return res.redirect("/groups/allusers");
    }

    if (!Array.isArray(req.session.selectedMembers)) {
        req.session.selectedMembers = [];
    }

    if (!req.session.selectedMembers.includes(memberId)) {
        req.session.selectedMembers.push(memberId);
        req.flash("success", "User added to the request list.");
    } else {
        req.flash("error", "User already added to the request list.");
    }

    console.log(req.session.selectedMembers);
    res.redirect("/groups/allusers");
}

export function groupFormRender(req, res) {
    res.render("groups/form");
}

export async function groupCreate(req, res) {
    const { groupName, description } = req.body;

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
}

export async function notifications(req, res) {
    const notifications = await Notification.find({ reciver: req.user._id })
        .populate("sender", "name")
        .sort({ createdAt: -1 });

    res.render("notifications/index", { notifications });
}

export async function allGroup(req, res) {
    const allGroups = await Group.find({})
        .populate("groupAdmin", "name")
        .populate("members", "name")
        .populate("pendingMembers", "name");

    res.render("groups/index", { allGroups });
}

export async function showGroup(req, res) {
    const { id } = req.params;
    const group = await Group.findById(id)
        .populate("Mentors", "name")
        .populate("members", "name")
        .populate("groupAdmin", "name");

    res.render("groups/show", { group });
}

export async function requestAccept(req, res) {
    const user = req.user._id;
    const groupId = req.body.group;

    let group = await Group.findByIdAndUpdate(groupId, {
        $addToSet: { members: user },
        $pull: { pendingMembers: user }
    });

    await Notification.findOneAndDelete({
        group: groupId,
        reciver: req.user._id
    });

    const updatedGroup = await Group.findById(groupId)
        .populate("Mentors", "name")
        .populate("members", "name")
        .populate("groupAdmin", "name");

    req.flash("success", `You have successfully joined the group: ${updatedGroup.groupName}`);
    res.redirect(`/groups/show/${groupId}`);
}

export async function deleteGroup(req, res) {
    let { id } = req.params;
    await Group.findByIdAndDelete(id);
    req.flash("success", "Group deleted successfully");
    res.redirect("/groups");
}