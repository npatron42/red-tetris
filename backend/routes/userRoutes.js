import express from "express";

var userRouter = express.Router();

/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.json({"users": "ouiqwdqwdqwdqwdqwd"});
});

export default userRouter;
