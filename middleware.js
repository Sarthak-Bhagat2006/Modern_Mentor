const Group = require("./models/group")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You have to logged in first !!");
        return res.redirect("/login");
    }
    next();
};

module.exports.isAdmin = async (req, res, next) => {
    let { id } = req.params;
    let group = await Group.findById(id);

    if (!group) {
        req.flash("error", "Group not found");
        return res.redirect("/groups");
    }

    if (!group.groupAdmin.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the Admin of group");
        return res.redirect(`/groups`);
    }
    next();
}
module.exports.isMember = async (req, res, next) => {
    let { id } = req.params;
    let group = await Group.findById(id);

    if (!group) {
        req.flash("error", "Group not found");
        return res.redirect("/groups");
    }

    const isMember = group.members.some(memberId =>
        memberId.equals(res.locals.currUser._id)
    );

    const isAdmin = group.groupAdmin.equals(res.locals.currUser._id);

    if (!isMember && !isAdmin) {
        req.flash("error", "You are not a member of this group");
        return res.redirect(`/groups`);
    }


    next();
};
module.exports.saveRedirectUser = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;


    }
    next();
};


