/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   HomePage.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 17:21:52 by npatron           #+#    #+#             */
/*   Updated: 2024/12/24 15:35:56 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { getUser } from '../api/api.js'

import Logout from './Logout.jsx';
import Welcome from './Welcome.jsx';
import TetrisHome from './TetrisHome.jsx';

const HomePage = () => {


	const testButton = async () => {

		const result = await getUser();
		console.log(result)

	}

	return (
		<div>
			<Welcome />
			<Logout />
			<TetrisHome />
		</div>
	)

	
}

export default HomePage;