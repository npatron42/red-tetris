/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 15:26:42 by npatron           #+#    #+#             */
/*   Updated: 2025/11/17 16:01:44 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import http from 'http';
import debug from 'debug';

import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

import principalRouter from './src/routes/index.js';
import userRouter from './src/routes/userRoutes.js';
import matchHistoryRouter from './src/routes/matchHistoryController.js';
import socketsServer from './src/socket/socket.js';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const port = normalizePort(process.env.PORT || '8000');
app.set('port', port);

const server = http.createServer(app);

const corsOptions = {
	origin: 'http://localhost:5173',
	methods: ['GET', 'POST'],
	allowedHeaders: ['Content-Type'],
	credentials: true,
};

app.use(cors(corsOptions));

const io = new Server(server, {
	cors: corsOptions,
});

socketsServer(io);

server.listen(port);
console.log(`Server is listening on http://localhost:${port}`);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}

	if (port >= 0) {
		return port;
	}

	return false;
}

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
		default:
			throw error;
	}
}

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	debug('Listening on ' + bind);
}

app.use('/', principalRouter);
app.use('/user', userRouter);
app.use('/match-history', matchHistoryRouter);

export default app;
