/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   testUtils.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/12 03:01:43 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 03:01:45 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


export const createSpy = (impl = () => undefined) => {
	const fn = (...args) => {
		fn.calls.push(args);
		return impl(...args);
	};
	fn.calls = [];
	return fn;
};
