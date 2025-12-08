/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomRoutes.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 13:15:38 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 15:56:22 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from "express";
import { create, getAll, getById } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/create", create);
roomRouter.get("/", getAll);
roomRouter.get("/:id", getById);

export default roomRouter;
