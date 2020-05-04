const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const registerSchema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  };
  return Joi.validate(data, registerSchema);
};
module.exports.registerValidation = registerValidation;

const loginValidation = (data) => {
  const loginSchema = {
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  };
  return Joi.validate(data, loginSchema);
};
module.exports.loginValidation = loginValidation;

const eventValidation = (data) => {
  const eventSchema = {
    category: Joi.required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    maxPlayers: Joi.number().min(2).max(30).required(),
    description: Joi.string().allow("").optional(),
  };
  return Joi.validate(data, eventSchema);
};
module.exports.eventValidation = eventValidation;

const userValidation = (data) => {
  const userSchema = {
    image: Joi.string().optional().allow(""),
    name: Joi.string().min(3).optional().allow(""),
    email: Joi.string().min(6).email().optional().allow(""),
    description: Joi.string().allow("").optional(),
  };
  return Joi.validate(data, userSchema);
};
module.exports.userValidation = userValidation;
