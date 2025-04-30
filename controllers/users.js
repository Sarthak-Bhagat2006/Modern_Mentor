const User = require("../models/user");


module.exports.allUsers = async (req, res) => {
    const allUsers = await User.find({ _id: { $nin: req.user._id } });

    res.render("users/index", { allUsers });
}
module.exports.publicView = async (req, res) => {
    const allUsers = await User.find({ _id: { $nin: req.user._id } });

    res.render("users/indexall", { allUsers });
}

module.exports.show = async (req, res) => {
    let { id } = req.params;
    let user = await User.findById(id);

    res.render("users/show", { user });
}