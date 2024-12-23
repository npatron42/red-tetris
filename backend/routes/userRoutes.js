import express from "express";

import { createUser, loginUser, getUser } from "../controllers/usersController.js"; 

var userRouter = express.Router();

/* GET users listing. */
userRouter.get('/', getUser);

userRouter.post('/createUser', createUser);

userRouter.post('/login', loginUser);

export default userRouter;
