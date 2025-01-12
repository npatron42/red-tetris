/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   HomePage.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 17:21:52 by npatron           #+#    #+#             */
/*   Updated: 2024/12/27 18:30:48 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { getUser } from '../api/api.js'

import Logout from './Logout.jsx';
import Welcome from './Welcome.jsx';
import TetrisHome from './TetrisHome.jsx';

const HomePage = () => {

	return (
		<div>
			<Welcome />
			<Logout />
			<TetrisHome />
		</div>
	)

	
}

export default HomePage;