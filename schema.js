// const Joi = require('joi');

// const userSchema = Joi.object({
//   user: Joi.object({
//     email: Joi.string().email().required(),
//     name: Joi.string()
//       .min(2)
//       .max(50)
//       .required()
//       .messages({
//         'string.min': 'Name should be at least 2 characters long',
//         'string.max': 'Name should not exceed 50 characters',
//         'any.required': 'Name is required'
//       }),

//     role: Joi.string()
//       .valid('Mentor', 'Student')
//       .required()
//       .messages({
//         'any.only': 'Invalid role specified',
//         'any.required': 'Role is required'
//       }),

//     domain:[ (Joi.string().min(2).max(30))
//       .min(1)
//       .required()
//       .messages({
//         'array.min': 'At least one domain is required',
//         'any.required': 'Domain is required'
//       })],

//     skills: [(Joi.string().required())
//       .required()],

//     linkedin: Joi.string()
//       .uri()
//       .allow('')
//       .messages({
//         'string.uri': 'Please provide a valid LinkedIn URL'
//       }),

//     github: Joi.string()
//       .uri()
//       .allow('')
//       .messages({
//         'string.uri': 'Please provide a valid GitHub URL'
//       }),

//     about: Joi.string()
//       .min(5)  // Changed from 5 to match error message
//       .max(1000) // Changed from 150 to match error message
//       .required()
//       .messages({
//         'string.min': 'About should be at least 20 characters',
//         'string.max': 'About should not exceed 1000 characters',
//         'any.required': 'About section is required'
//       }),

//     createdAt: Joi.date().default(Date.now),
//     updatedAt: Joi.date().default(Date.now)
//   }).required(),
  
//   password: Joi.string()
//     .min(8)
//     .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
//     .required()
//     .messages({
//       'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
//       'string.min': 'Password must be at least 8 characters'
//     })
// });

// module.exports = userSchema;