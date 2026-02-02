/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Home.jsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 17:21:52 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 14:54:19 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { PlayComponent } from "../multi/play-component/PlayComponent";

const Home = () => {
    return (
        <div className="home-page-container">
            <PlayComponent />
        </div>
    );
};

export default Home;
