/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.jsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/29 14:49:58 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 14:50:00 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
);
