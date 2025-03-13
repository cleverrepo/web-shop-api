const userController = require('../Controller/user.controller.js');
const express = require('express');
const userRouter = express.Router();

userRouter.post('/register', userController.registerUser);  
userRouter.post("/login", userController.login);  
userRouter.post("/verify-email",userController.verifyEmail)
userRouter.post("/resend-code",userController.resendVerificationCode)

userRouter.post("/log-out", userController.logout);
userRouter.put("/update-password", userController.forgotPassword);

module.exports = userRouter;
