// --- Imports ---
import User from '../models/user.model.js';

// --- Controller Functions ---

export async function allUsers(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments({ _id: { $ne: req.user._id } });
    const allUsers = await User.find({ _id: { $ne: req.user._id } })
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(totalUsers / limit);

    res.render("users/index", { allUsers, page, totalPages });
}

export async function publicView(req, res) {
    const allUsers = await User.find({ _id: { $nin: req.user._id } });
    res.render("users/indexall", { allUsers });
}

export async function show(req, res) {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render("users/show", { user });
}