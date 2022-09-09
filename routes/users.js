const express = require('express');

const userRouter = express.Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

userRouter.get('/users', getUsers);

userRouter.get('/users/me', getUserInfo);
userRouter.get('/users/:userId', getUserById);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateUserAvatar);
module.exports = userRouter;
