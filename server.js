
const express = require('express');
const utils = require('./utils');
const path = require('path')
const uuid = require("uuid");
const webpack = require('webpack');
const cors = require('cors');
const webpackDevMiddleware = require('webpack-dev-middleware');
const app = express();
const socket = require('socket.io');
const config = require('./webpack/base.js');
const { callbackify } = require('util');
const compiler = webpack(config);
const PORT = process.env.PORT || 5000;


const rooms = {};

/**
 * CORS ERROR Management
 */
app.use(cors());


/**
 * Static files directory
*/
app.use("/src", express.static('./src/'));
app.use("/phaser", express.static("./node_modules/phaser/"));

/**
 * Webpack management
 */
app.use(webpackDevMiddleware(compiler,{
    publicPath: config.output.publicPath,
}));

const server = app.listen(PORT, () =>{
    console.log("Listening on " + PORT);
})

const io = socket(server);

app.get('*', (req,res) =>{
    console.log("Lo corri");
    res.sendFile(path.join(__dirname,"index.html"));
})

const joinRoom = (socket,player,room) => {
    room.sockets.push(socket);
    room.players.push(player);
    socket.join(room.id, () =>{
        socket.roomId = room.id;
        console.log(socket.id, "Joined", room.id);
    });
};

/**
 * Metodo que se encarga de manera asincronica mandar el listado de jugadores por sala
 * @param {String} roomId 
 */
const refreshLobby = (roomId) =>{
    return new Promise(() =>{
        setTimeout(() =>{
            let room = rooms[roomId];
            io.to(room.id).emit("RefreshLobby", room.players);
        }, 200);
    });
};

io
    .on("connection", (socket) => {
        console.log("SOMEONE IS IN THE SOCKET");    

        socket.on("createRoom", async (player) => { 
            let name = utils.generateRandomID();
            console.log(name);
            const room = {
                id: name,
                name: uuid.v1(),
                host: socket.id,
                players: [],
                sockets: []
            };
            rooms[room.id] = room;
            joinRoom(socket,player,room);
            socket.emit("createdRoom",name);
            await refreshLobby(room.id);
        });

        socket.on("joinRoom", async (roomId,player) =>{
            const room = rooms[roomId];
            joinRoom(socket,player,room);
            socket.emit("createdRoom", roomId);
            await refreshLobby(roomId);
        });

        socket.on("FindHost", (roomID) =>{
            let room = rooms[roomID];
            if(room.host == socket.id){
                socket.emit("Host",true);
            }else{
                socket.emit("Host",false);
            }
        });

        socket.on("StartGame", (roomID) =>{
            io.to(roomID).emit("RoundStart", "Partida iniciada");
        });
});
