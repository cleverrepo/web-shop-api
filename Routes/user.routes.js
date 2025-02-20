const userController = require('../Controller/user.controller.js');
const express = require('express');
const userRouter = express.Router();

userRouter.post('/register', userController.registerUser);  
userRouter.post("/login", userController.login);  
userRouter.put("/update", userController.forgotPassword);

module.exports = userRouter;
