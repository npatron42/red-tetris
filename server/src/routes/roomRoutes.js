/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomRoutes.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 13:15:38 by npatron           #+#    #+#             */
/*   Updated: 2025/12/10 15:34:20 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { create, getAll, getByName, joinRoomByName, leaveRoom, restartGame, startGame } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/create", authenticate, create);
roomRouter.get("/", authenticate, getAll);
roomRouter.get("/:roomName", authenticate, getByName);
roomRouter.post("/join", authenticate, joinRoomByName);
roomRouter.post("/leave", authenticate, leaveRoom);
roomRouter.post("/start-game", authenticate, startGame);
roomRouter.post("/restart-game", authenticate, restartGame);

export default roomRouter;
