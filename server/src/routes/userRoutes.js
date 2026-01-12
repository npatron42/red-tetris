/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userRoutes.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 15:28:46 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 15:56:30 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from "express";

import { createUser, getUser, loginUser } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/get", authenticate, getUser);
userRouter.get("/me", authenticate, getUser);

userRouter.post("/create", createUser);
userRouter.post("/login", loginUser);

export default userRouter;
