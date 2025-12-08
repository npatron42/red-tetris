/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userRoutes.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 15:28:46 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 12:56:22 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from "express";

import { createUser, getUser, createHistoryMatch, getHistoryMatchByUsername } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/get", getUser);

userRouter.post("/create", createUser);

userRouter.post("/create-history-match", createHistoryMatch);

userRouter.get("/get-history-match", getHistoryMatchByUsername);

export default userRouter;
