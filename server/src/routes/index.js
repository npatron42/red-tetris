/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 15:28:51 by npatron           #+#    #+#             */
/*   Updated: 2025/11/17 16:35:28 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from "express";
import userRouter from "./userRoutes.js";
var principalRouter = express.Router();

principalRouter.get("/", function (req, res, next) {
    res.json({ test: "qwdqwdqwdqwdqwdqwdd" });
});

principalRouter.use("/user", userRouter);

export default principalRouter;
