/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersController.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 22:54:31 by npatron           #+#    #+#             */
/*   Updated: 2024/12/22 23:05:23 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from "express"

export const createUser = (req, res) => {
	
	console.log("myData --> ", req.body);
	res.json({"test": "sicces"})

};
