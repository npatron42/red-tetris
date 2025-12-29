/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Jukebox.jsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/29 17:13:40 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 17:45:17 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./Jukebox.css";

// HTMLMediaElement --> explain to fab that the .play() and .pause() are methods of the HTMLMediaElement interface (API)

import { useEffect, useMemo, useRef, useState } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { Music2, Volume2, VolumeX } from "lucide-react";

const MENU_TRACK = "/music/tetris-menu-music.mp3";
const GAME_TRACK = "/music/tetris-game-music.mp3";

const Jukebox = () => {
	const location = useLocation();
	const audioRef = useRef(null);
	const [volume, setVolume] = useState(0.4);
	const [isMuted, setIsMuted] = useState(false);
	const [currentTrack, setCurrentTrack] = useState(MENU_TRACK);

	const isInGameRoute = useMemo(() => {
		const soloMatch = matchPath({ path: "/solo/:gameId", end: true }, location.pathname);
		const multiMatch = matchPath({ path: "/:roomName/:leaderUsername", end: true }, location.pathname);

		if (soloMatch && location.pathname !== "/solo/game-room") {
			return true;
		}
		if (multiMatch && !location.pathname.startsWith("/solo/")) {
			return true;
		}
		return false;
	}, [location.pathname]);

	const isInGame = isInGameRoute;

	useEffect(() => {
		setCurrentTrack(isInGame ? GAME_TRACK : MENU_TRACK);
	}, [isInGame]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const clampedVolume = Math.min(Math.max(volume, 0), 1);
		audio.volume = clampedVolume;
	}, [volume]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		audio.muted = isMuted;

		if (isMuted) {
			audio.pause();
			return;
		}

		const playAudio = async () => {
			try {
				await audio.play();
			} catch (error) {
				console.warn("Audio playback blocked by the browser", error);
			}
		};

		playAudio();
	}, [isMuted]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		audio.pause();
		audio.currentTime = 0;
		audio.src = currentTrack;

		if (!isMuted) {
			const playPromise = audio.play();
			if (playPromise) {
				playPromise.catch((error) => console.warn("Audio playback blocked by the browser", error));
			}
		}
	}, [currentTrack, isMuted]);

	const toggleMute = () => {
		setIsMuted((prev) => !prev);
	};

	const handleVolumeChange = (event) => {
		const nextVolume = Number(event.target.value);
		setVolume(nextVolume);

		if (nextVolume > 0 && isMuted) {
			setIsMuted(false);
		}
	};

	return (
		<div className="jukebox">
			<div className="jukebox-row">
				<div className="jukebox-track">
					<Music2 size={18} />
					<span>Music!</span>
				</div>
				<button type="button" className="jukebox-toggle" onClick={toggleMute}>
					{isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
					<span>Mute</span>
				</button>
			</div>
			<div className="jukebox-volume">
				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					value={volume}
					onChange={handleVolumeChange}
					aria-label="Volume"
				/>
			</div>
			<audio ref={audioRef} loop />
		</div>
	);
};

export default Jukebox;
