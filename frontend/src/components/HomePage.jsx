/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   HomePage.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 17:21:52 by npatron           #+#    #+#             */
/*   Updated: 2024/12/23 17:28:19 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { getUser } from '../api/api.js'

import Logout from './Logout.jsx';
import Welcome from './Welcome.jsx';
import ArcadeMachine from './ArcadeMachine.jsx';

const HomePage = () => {


	const testButton = async () => {

		const result = await getUser();
		console.log(result)

	}

	return (
		<div>
			<Welcome />
			<Logout />
			<ArcadeMachine />
		</div>
	)

	
}

export default HomePage;