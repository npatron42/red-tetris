/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   soloGameRoutes.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 17:48:29 by npatron           #+#    #+#             */
/*   Updated: 2025/12/11 18:33:54 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from "express";
import { createSoloGame, getSoloGame, endSoloGame } from "../controllers/soloGameController.js";

const soloGameRouter = express.Router();

soloGameRouter.post("/create", createSoloGame);
soloGameRouter.get("/:gameId", getSoloGame);
soloGameRouter.post("/:gameId/end", endSoloGame);

export default soloGameRouter;
