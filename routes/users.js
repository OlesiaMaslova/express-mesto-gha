const express = require('express');
const { UserValidator } = require('../validators');

const userRouter = express.Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

userRouter.get('/users', getUsers);

userRouter.get('/users/me', getUserInfo);
userRouter.get('/users/:userId', UserValidator, getUserById);
userRouter.patch('/users/me', UserValidator, updateUser);
userRouter.patch('/users/me/avatar', UserValidator, updateUserAvatar);
module.exports = userRouter;
