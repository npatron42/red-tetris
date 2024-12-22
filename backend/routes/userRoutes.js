import express from "express";

import { createUser } from "../controllers/usersController.js";

var userRouter = express.Router();

/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.json({"users": "ouiqwdqwdqwdqwdqwd"});
});

userRouter.get('/createUser', createUser);

export default userRouter;
