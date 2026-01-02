import express from "express";
import UserController from "./user.controller.js";

export const userRouter = express.Router();

// const userController = new UserController;
const userController = new UserController();

// userRouter.post('/signup', userController.signUp);
userRouter.post('/signup', (req, res) => {
    userController.signUp(req, res);
});

userRouter.post('/signin', userController.signIn);

export default userRouter;