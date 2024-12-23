import express from "express";

import { createUser, loginUser } from "../controllers/usersController.js"; 

var userRouter = express.Router();

/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.json({"users": "ouiqwdqwdqwdqwdqwd"});
});

userRouter.post('/createUser', createUser);

userRouter.post('/login', loginUser);

export default userRouter;
