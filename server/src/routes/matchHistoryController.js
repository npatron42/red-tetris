/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchHistoryController.js                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 12:57:19 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 12:57:39 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from "express";

import { createHistoryMatch, getHistoryMatchByUsername } from "../controllers/matchHistoryController.js";

const matchHistoryRouter = express.Router();

matchHistoryRouter.post("/create-history-match", createHistoryMatch);

matchHistoryRouter.get("/get-history-match", getHistoryMatchByUsername);

export default matchHistoryRouter;
