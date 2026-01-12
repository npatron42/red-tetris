/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userRoutes.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 15:28:46 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 15:19:36 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from "express";

import { createUser, getUser } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/get", authenticate, getUser);
userRouter.get("/me", authenticate, getUser);

userRouter.post("/create", createUser);

export default userRouter;
