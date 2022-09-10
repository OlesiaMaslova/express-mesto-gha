const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { OK } = require('../utils');
const { JWT_SECRET } = require('../config');
const AuthError = require('../errors/AuthError');
const BadRequestError = require('../errors/BadRequestError');
const DuplicatedValueError = require('../errors/DuplicatedValueError');
const NotFoundError = require('../errors/NotFoundError');

async function getUsers(req, res, next) {
  try {
    const users = await User.find({});
    res.status(OK).send(users);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.userId);
    if (!user) {
      return next(new NotFoundError('Такого пользователя не существует'));
    }
  } catch (err) {
    next(err);
  }
  return res.status(OK).send(user);
}

async function createUser(req, res, next) {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      name, about, avatar, email, password: hashedPassword,
    }).save();
    return res.status(OK).send({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new DuplicatedValueError('Такой email уже зарегестрирован'));
    }
    return next(err);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AuthError('Неверные почта или пароль'));
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return next(new AuthError('Неверные почта или пароль'));
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    if (!token) {
      return next(new AuthError('Некорректный токен'));
    }
    return res.status(OK).send({ token });
  } catch (err) {
    return next(err);
  }
}

async function getUserInfo(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new NotFoundError('Нет запрашиваемой информации'));
    }
    return res.status(OK).send(user);
  } catch (err) {
    return next(err);
  }
}

async function updateUser(req, res, next) {
  const { name, about } = req.body;
  let user;
  try {
    user = await User.findByIdAndUpdate(req.user._id, { name, about }, {
      new: true,
      runValidators: true,
    });
  } catch (err) {
    next(err);
  }
  return res.status(OK).send(user);
}

async function updateUserAvatar(req, res, next) {
  let user;
  try {
    user = await User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
      new: true,
      runValidators: true,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Ошибка валидации'));
    }
    next(err);
  }
  return res.status(OK).send(user);
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getUserInfo,
};
