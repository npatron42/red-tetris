import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { expressjwt } from "express-jwt";
import http from 'http';
import principalRouter from './routes/index.js';
import debug from 'debug';
import userRouter from './routes/userRoutes.js';
import { Server } from 'socket.io'
import socketLogic from './socket/socket.js';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




app.use(morgan('dev'));   
app.use(cors());         
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));


app.use(
  expressjwt({
    secret: 'momo',
    algorithms: ['HS256'],
  }).unless({ path: ['/user/login', '/user/createUser'] })
);

const port = normalizePort(process.env.PORT || '8000');
app.set('port', port);




/**
 * Create HTTP server.
*/

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

socketLogic(io);
/**
 * Listen on provided port, on all network interfaces.
*/

server.listen(port);
console.log(`Server is listening on http://localhost:${port}`);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
*/

function normalizePort(val) {
  const port = parseInt(val, 10);
  
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  
  if (port >= 0) {
    // port number
    return port;
  }
  
  return false;
}

/**
 * Event listener for HTTP server "error" event.
*/

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  
  const bind = typeof port === 'string'
  ? 'Pipe ' + port
  : 'Port ' + port;
  
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
        default:
          throw error;
        }
      }
      
      /**
       * Event listener for HTTP server "listening" event.
      */
     
     function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
  
  app.use('/', principalRouter);
  app.use('/user', userRouter)

  

export default app;
