const {
  Joi, celebrate, Segments,
} = require('celebrate');

const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
const AuthorizationValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
const RegistrationValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexp),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const UserValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexp),
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
});

const CardValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regexp),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
});

module.exports = {
  AuthorizationValidator,
  RegistrationValidator,
  UserValidator,
  CardValidator,
};
