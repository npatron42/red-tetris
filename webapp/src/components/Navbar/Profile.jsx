/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Profile.jsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 17:41:02 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 17:39:30 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./Profile.css";

import { useUser } from "../../providers/UserProvider";
import { User } from "lucide-react";

export const Profile = () => {
	const { user } = useUser();
	if (!user) {
		return null;
	}
	return (
		<div className="profile-container">
			<div className="profile-icon-circle">
				<User size={28} color="#fdd835" />
			</div>
			<span className="profile-username">{user}</span>
		</div>
	);
};
