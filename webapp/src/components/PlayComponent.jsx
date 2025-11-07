/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PlayComponent.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/06 17:01:45 by npatron           #+#    #+#             */
/*   Updated: 2025/11/06 18:20:42 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './css/PlayComponent.css'

import { Joystick, BadgePlus, MoveRight } from 'lucide-react';

export const PlayComponent = () => {
    return (
        <div className="play-component-container">
            <header className='play-header'>
                <Joystick size={24} />
                <span>PLAY</span>
                <Joystick size={24} />
            </header>
            <button className="play-button">
                Create a room
                <BadgePlus size={16} />
            </button>
            <button className="play-button">
                Join a room
                <MoveRight size={16} />
            </button>
        </div>
    );
}