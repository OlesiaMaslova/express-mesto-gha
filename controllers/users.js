const User = require('../models/user');
const {
  OK, ERR_NOT_FOUND, ERR_BAD_REQUEST, ERR_SERVER_ERROR,
} = require('../utils');

async function getUsers(req, res) {
  try {
    const users = await User.find({});
    res.status(OK).send(users);
  } catch (err) {
    res.status(ERR_SERVER_ERROR).send({ message: 'Ошибка на сервере', ...err });
  }
}

async function getUserById(req, res) {
  let user;
  try {
    user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(ERR_NOT_FOUND).send({ message: 'Такого пользователя не существует' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(ERR_BAD_REQUEST).send({ message: 'Невалидный ID пользователя' });
    }
    res.status(ERR_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
  }
  return res.status(OK).send(user);
}

async function createUser(req, res) {
  try {
    const user = await new User(req.body).save();
    res.status(OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Некорректные данные пользователя' });
      return;
    }
    res.status(ERR_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
  }
}

async function updateUser(req, res) {
  const { name, about } = req.body;
  let user;
  try {
    user = await User.findByIdAndUpdate(req.user._id, { name, about }, {
      new: true,
      runValidators: true,
    });
    if (!req.user._id) {
      return res.status(ERR_NOT_FOUND).send({ message: 'Такого пользователя не существует' });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERR_BAD_REQUEST).send({ message: 'Некорректные данные пользователя' });
    }
    res.status(ERR_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
  }
  return res.status(OK).send(user);
}

async function updateUserAvatar(req, res) {
  let user;
  try {
    user = await User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
      new: true,
      runValidators: true,
    });
    if (!req.body.avatar) {
      return res.status(ERR_BAD_REQUEST).send({ message: 'Введены некорректные данные' });
    }
    if (!req.user._id) {
      return res.status(ERR_NOT_FOUND).send({ message: 'Такого пользователя не существует' });
    }
  } catch (err) {
    return res.status(ERR_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
  }
  return res.status(OK).send(user);
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
