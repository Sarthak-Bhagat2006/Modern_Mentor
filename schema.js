const Joi = require("joi");

userSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().min(1).required(),
        password: Joi.string().required(),
        role: Joi.string().valid("student", "mentor").required(), // optional: restrict roles
        domain: Joi.array().items(Joi.string()).default([]),
        skills: Joi.array().items(Joi.string()).default([]),
        linkedin: Joi.string().uri().allow(""),
        github: Joi.string().uri().allow(""),
        profileImage: Joi.string().uri().allow(""),
        about: Joi.string().min(10).required(),
    }).required()
});

module.exports.groupSchema = Joi.object({
    group: Joi.object({
        groupName: Joi.string().min(3).required(),
        groupAdmin: Joi.string().hex().length(24).required(),
        members: Joi.array().items(Joi.string()).default([]),
        mentors: Joi.array().items(Joi.string()).default([]),
        pendingMembers: Joi.array().items(Joi.string()).default([]),
        description: Joi.string().max(500),
    }).required()
});

