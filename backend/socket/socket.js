/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socket.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/28 18:50:10 by fpalumbo          #+#    #+#             */
/*   Updated: 2024/12/28 20:55:15 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const allSockets = new Map();

const allRooms = new Map();

class Player {
	
	constructor(userId) {
		
	  this.id = userId;
	  this.score = 0;
	  this.leader = false;
	  this.winner = false;
	}
	

	printPlayer() {

		console.log(` ---- PlayerId --> ${this.id}, Score --> ${this.score}\n
			---- Winner --> ${this.winner}, Leader --> ${this.leader} `);
		return ;
	}
}

class Room {
	constructor(roomId) {
	  	this.roomId = roomId;
	  	this.leader = "nobody";
	  	this.players = []; 
	}
  
	addPlayer(player) {
	  	if (player instanceof Player) {
			this.players.push(player);
	}}
  

	setLeader(leader) {
		this.leader = leader;
	}

}

function addSocketId(socket) {
	allSockets.set(socket.userId, socket.id);
}

function removeSocketId(socket) {
	allSockets.delete(socket.userId)
}

function sendToPlayer(io, userId) {

	const socket = allSockets.get(userId)

	io.to(socket).emit("GAME IS READY");

	return ;
	
}

function sendToPlayersInRoom(io, socket, userId) {

	const socket = allSockets.get(userId)

	io.to(socket).emit("GAME IS READY");

	return ;
	
}


// Return True if the Room is full, return false if not

function handleRooms(userId, roomId) {

	const room = allRooms.get(roomId)

	// myRoom undefined --> Player = leader

	if (room == undefined) {
		
		const myRoom = new Room(roomId)

		const players = new Array();
		
		const myPlayer = new Player(userId)
		
		
		myRoom.addPlayer(myPlayer)
		myRoom.setLeader(myPlayer.id)

		myPlayer.leader = true;
		players.concat(myPlayer)
		
		allRooms.set(roomId, myRoom);
		
	}

	// Room existing --> Add player to Players Array

	else {

		const myRoom = room;
		const myPlayer = new Player(userId);
		
		myRoom.addPlayer(myPlayer)
	}
}


function isGameReadyToLaunch(roomId) {

	const room = allRooms.get(roomId);
		
	if (room.players.length == 2)
		return true;
	return false;
}



export default function socketLogic(io) {
    
    io.on('connection', (socket) => {
		
		const { userId, roomId } = socket.handshake.query;
		socket.userId = userId;
		addSocketId(socket)

		handleRooms(socket, roomId)
		
		if (isGameReadyToLaunch(roomId) == true) {
			
			socket.

		}




		
      	socket.on('message', (data) => {
        	console.log('Message reçu :', data);
        	socket.emit('response', 'Message reçu');
      	});
  
      	socket.on('disconnect', () => {
			removeSocketId(socket)
      	});

      
    });
  }