import express from 'express';
import userRouter from './userRoutes.js';
var principalRouter = express.Router();

/* GET home page. */
principalRouter.get('/', function(req, res, next) {
  res.json({"test": "qwdqwdqwdqwdqwdqwdd"});
});


principalRouter.use('/users', userRouter);

export default principalRouter;