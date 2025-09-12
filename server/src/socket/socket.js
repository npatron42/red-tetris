/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socket.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/28 18:50:10 by fpalumbo          #+#    #+#             */
/*   Updated: 2025/01/17 11:45:22 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { UserManager } from "../manager/UserManager.js";
import { Game } from "../game/tetris.js";


export const allSockets = new Map();

const allRooms = new Map();

const userManager = new UserManager();

export class Room {
	constructor(roomId) {
	  	this.roomId = roomId;
	  	this.leader = "nobody";
		this.launched = false;
	  	this.players = [];
	}
  
	addPlayer(player) {
		this.players.push(player);
	}
  

	setLeader(leader) {
		this.leader = leader;
	}

	printRoom() {
		
		if (this.roomId === undefined) {
			console.error("Erreur : RoomId est undefined !");
		}
		console.log("------------------------------");
		console.log("| RoomId --> ", this.roomId);
		console.log("| Players --> ", this.players.length);
		console.log("| Launched ? --> ", this.launched);
		console.log("------------------------------");
	}
}

export function addSocketId(socket) {
	allSockets.set(socket.userId, socket.id);
}

export function addRoom(id, room) {
	allRooms.set(id, room)
}

export function getRoom(id) {
	return allRooms.get(id);
}

function removeSocketId(socket) {
	allSockets.delete(socket.userId)
}

export function sendToPlayer(io, userId, string, json) {

	const socket = allSockets.get(userId)

	io.to(socket).emit(string, json);
	return ;
	
}

export function sendToPlayersInRoom(io, userId, string, json) {

	const room = inWhatRoomIsMyPlayer(userId)
	
	const players = room.players;
	
	const socketOne = allSockets.get(players[0])
	const socketTwo = allSockets.get(players[1])
	
	io.to(socketOne).emit(string, json);
	io.to(socketTwo).emit(string, json);

	return ;
}


function handleRooms(userId, roomId) {

	const room = getRoom(roomId)
	
	let output = "0"

	if (!room) {
		
		const myRoom = new Room(roomId)
				
		myRoom.addPlayer(userId)

		myRoom.leader = userId;
		myRoom.roomId = roomId
		addRoom(roomId, myRoom);		
		myRoom.printRoom();
	}

	else {
		
		if (room.players.length == 1) {
			room.addPlayer(userId)
			room.printRoom();
		}
		else
			output = "error: room full"
	}
	return output
}

function isGameReadyToLaunch(roomId) {

	const room = getRoom(roomId);
		
	if (room.players.length == 2 && room.launched == false) {
		room.players.launched == true;
		return true;
	}
	return false;
}

function removePlayerFromRoom(io, userId, output) {

	const room = inWhatRoomIsMyPlayer(userId);
		
	if (output != "0")
		return ;

	if (!room)
		throw new Error("Failed: invalid room")
	
	if (room.players.length === 2) {
		room.players = room.players.filter(player => player !== userId);
		
		// Player was leader
		
		if (room.leader == userId) {
			room.leader = room.players[0];
		}
		const playerToPrevent = room.players[0];
		const dataToSend = {
			"enemy": undefined
		}
		sendToPlayer(io, playerToPrevent, 'enemyDisconnected', dataToSend)
		
	}
	else if (room.players.length == 1) {
		allRooms.delete(room.roomId)
	}
	else
		return ;
}

function inWhatRoomIsMyPlayer(userId) {

	const rooms = allRooms.values()
	for (const room of rooms) {
		
		let players = room.players;
		if (players.includes(userId)) {
			return room;
		}
	}
	return null;
}

async function launchGame(io, roomId) {

	const room = getRoom(roomId)
	// const userManager = new UserManager()

	const players = room.players;
	
	const playerOne = await userManager.getUserById(Number(players[0]))
	const playerTwo = await userManager.getUserById(Number(players[1]))
	
	const dataToSendToPlayerOne = {
		"enemy": playerTwo.username,
		"leader": room.leader,
	}
	
	const dataToSendToPlayerTwo = {
		"enemy": playerOne.username,
		"leader": room.leader,
	}

	sendToPlayer(io, players[0], 'enemyName', dataToSendToPlayerOne)
	sendToPlayer(io, players[1], 'enemyName', dataToSendToPlayerTwo)

	const myGame = new Game();

	myGame.generateTetrominos();

	const dataToSend = {
		
		"tetrominos": myGame.tetrominosGenerated
	}
		
	sendToPlayersInRoom(io, players[0], 'tetrominosGenerated', dataToSend)
	
	return ;
}

export default async function socketLogic(io) {
    
    io.on('connection', (socket) => {
		
		const { userId, roomId } = socket.handshake.query;
		socket.userId = userId;
		addSocketId(socket)
				
		const output = handleRooms(userId, roomId)
		
		if (output == '0') {
			
			if (isGameReadyToLaunch(roomId) == true) {
				launchGame(io, roomId)
			}
		}
		else {

			if (output == "error: room full")
				console.log("ROOM FUUUUULLLL")
		}
		socket.on('move', () => {
			
			
      	});
		
      	socket.on('disconnect', () => {
			removeSocketId(socket)
			removePlayerFromRoom(io, userId, output)
      	});

      
    });
  }