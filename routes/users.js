const express = require('express');

const userRouter = express.Router();
const { getUsers, getUserById, createUser, updateUser, updateUserAvatar } = require('../controllers/users');

userRouter.get('/users', getUsers);

userRouter.get('/users/:userId', getUserById);

userRouter.post('/users', createUser);

userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateUserAvatar);
module.exports = userRouter;
