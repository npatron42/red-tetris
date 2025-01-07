/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socket.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/28 18:50:10 by fpalumbo          #+#    #+#             */
/*   Updated: 2025/01/07 21:34:58 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const allSockets = new Map();

const allRooms = new Map();

class Room {
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

function addSocketId(socket) {
	allSockets.set(socket.userId, socket.id);
}

function addRoom(id, room) {
	allRooms.set(id, room)
}

function getRoom(id) {
	return allRooms.get(id);
}

function removeSocketId(socket) {
	allSockets.delete(socket.userId)
}

function sendToPlayer(io, userId) {

	const socket = allSockets.get(userId)

	io.to(socket).emit("GAME IS READY");

	return ;
	
}

function sendToPlayersInRoom(io, userId) {

	const socket = allSockets.get(userId)

	io.to(socket).emit("GAME IS READY");

	return ;
	
}


function handleRooms(userId, roomId) {

	const room = getRoom(roomId)
	console.log(`RoomId in handlerooms --> ${roomId}`)
	
	let output = "0"

	if (!room) {
		
		const myRoom = new Room(roomId)
				
		myRoom.addPlayer(userId)

		myRoom.leader = userId;
		myRoom.roomId = roomId
		addRoom(roomId, myRoom);		
		console.log(`CREATION ROOM --> `);
		myRoom.printRoom();
	}

	else {
		
		if (room.players.length == 1) {
			room.addPlayer(userId)
			console.log(`ROOM ALREADY CREATED --> `);
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

function removePlayerFromRoom(userId, output) {

	const room = inWhatRoomWasMyPlayer(userId);
	
	console.log(`room where player leaved ==> ${room.roomId}`)
	
	if (output != "0")
		return ;

	if (!room)
		throw new Error("Failed: invalid room")
	
	if (room.players.length === 2) {
		room.players = room.players.filter(player => player !== userId);
		console.log(`Now len players --> ${room.players.length}`)
		
		// Player was leader
		
		if (room.leader == userId) {
			room.leader = room.players[0];
		}
	}
	else if (room.players.length == 1) {
		console.log("Room deleted")
		allRooms.delete(room.roomId)
	}
	else
		return ;
}

function inWhatRoomWasMyPlayer(userId) {

	const rooms = allRooms.values()
	for (const room of rooms) {
		
		let players = room.players;
		if (players.includes(userId)) {
			return room;
		}
	}
	return null;
}


export default function socketLogic(io) {
    
    io.on('connection', (socket) => {
		
		const { userId, roomId } = socket.handshake.query;
		socket.userId = userId;
		addSocketId(socket)
				
		const output = handleRooms(userId, roomId)
		
		if (output == '0') {
			
			if (isGameReadyToLaunch(roomId) == true) {
				console.log("GAME READYTOLAUNCH")
			}
		}
		else {

			if (output == "error: room full")
				console.log("ROOM FUUUUULLLL")
			// TODO --> send to socket error / launch game
		}

      	socket.on('message', (data) => {
        	console.log('Message reçu :', data);
        	socket.emit('response', 'Message reçu');
      	});
  
      	socket.on('disconnect', () => {
			removeSocketId(socket)
			removePlayerFromRoom(userId, output)
      	});

      
    });
  }