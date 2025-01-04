/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socket.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/28 18:50:10 by fpalumbo          #+#    #+#             */
/*   Updated: 2025/01/03 14:22:00 by npatron          ###   ########.fr       */
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

	getPlayerId() {
		return this.id;
	}

	
}

class Room {
	constructor(roomId) {
	  	this.roomId = roomId;
	  	this.leader = "nobody";
		this.launched = false;
	  	this.players = []; 
	}
  
	addPlayer(player) {
	  	if (player instanceof Player) {
			this.players.push(player);
	}}
  

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

	const room = allRooms.get(roomId)

	// myRoom undefined --> Player = leader

	if (room == undefined) {
		
		const myRoom = new Room(roomId)
		
		const myPlayer = new Player(userId)
		
		myRoom.addPlayer(myPlayer)

		myPlayer.leader = true;
		myRoom.leader = userId;
		myRoom.roomId = roomId

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
		
	if (room.players.length == 2 && room.launched == false) {
		room.players.launched == true;
		return true;
	}
	return false;
}



export default function socketLogic(io) {
    
    io.on('connection', (socket) => {
		
		const { userId, roomId } = socket.handshake.query;
		socket.userId = userId;
		addSocketId(socket)
		
		console.log("allSockets --> ", allSockets)
		
		handleRooms(socket, roomId)
		
		if (isGameReadyToLaunch(roomId) == true) {
			
			console.log("GAME READYTOLAUNCH")

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