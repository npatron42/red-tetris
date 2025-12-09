/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomRoutes.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 13:15:38 by npatron           #+#    #+#             */
/*   Updated: 2025/12/09 16:20:52 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from "express";
import { create, getAll, getByName, joinRoomByName } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/create", create);
roomRouter.get("/", getAll);
roomRouter.get("/:roomName", getByName);
roomRouter.post("/join", joinRoomByName);

export default roomRouter;
