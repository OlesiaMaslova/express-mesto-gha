const {
  Joi, celebrate, Segments,
} = require('celebrate');

const regexp = /((http|ftp|https):\/\/)?(([\w.-]*)\.([\w]*))/;
const regexpId = /^[0-9a-fA-F]{24}$/;
const AuthorizationValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
const RegistrationValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const UserValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexp),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().pattern(regexpId),
  }),
});

const CardValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regexp),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().pattern(regexpId),
  }),
});

const CardIdValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().pattern(regexpId),
  }),
});

module.exports = {
  AuthorizationValidator,
  RegistrationValidator,
  UserValidator,
  CardValidator,
  CardIdValidator,
};
