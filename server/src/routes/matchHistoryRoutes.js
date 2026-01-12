/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchHistoryRoutes.js                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/12 16:00:00 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 16:00:00 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createHistoryMatch, getHistoryMatch } from "../controllers/matchHistoryController.js";

const matchHistoryRouter = express.Router();

matchHistoryRouter.post("/create", authenticate, createHistoryMatch);
matchHistoryRouter.get("/me", authenticate, getHistoryMatch);

export default matchHistoryRouter;
