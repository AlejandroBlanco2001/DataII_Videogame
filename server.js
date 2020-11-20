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
const { Console } = require('console');
const compiler = webpack(config);
const PORT = process.env.PORT || 5000;

const rooms = {};

/**
 * Abstraccion del personaje por parte del servidor
 * @param {} username 
 * @param {*} x 
 * @param {*} y 
 * @param {*} active 
 */
function Player(socket,username,x,y,active,host){
    this.host = host;
    this.username = username;
    this.socket = socket;
    this.x = x;
    this.y = y;
    this.active = active;
}

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

const joinRoom = (socket,player,room,host) => {
    let p = new Player(socket.id,player,utils.getRandomRespawn().x, utils.getRandomRespawn().y, true);
    room.sockets[socket.id] = p;
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
            io.to(room.id).emit("RefreshLobby", room.sockets);
        }, 200);
    });
};

io
    .on("connection", (socket) => {
        
        socket.on("createRoom", async (player) => { 
            let name = utils.generateRandomID();
            console.log(name);
            const room = {
                id: name,
                name: uuid.v1(),
                host: socket.id,
                sockets: {},
                playing: false
            };
            rooms[room.id] = room;
            joinRoom(socket,player,room,true);
            socket.emit("createdRoom",name);
            await refreshLobby(room.id);
        });

        socket.on("joinRoom", async (roomId,player) =>{
            if(!utils.checkUserInRoom(rooms,roomId)){
                const room = rooms[roomId];
                joinRoom(socket,player,room,false);
                socket.emit("createdRoom", roomId);
                await refreshLobby(roomId);
            }
        });

        socket.on("isLeader",(roomID) =>{
            let host = rooms[roomID].host == socket.id;
            socket.emit("Leader",host);
        });

        socket.on("StartGame", (roomID) =>{
            let players = rooms[roomID].sockets;
            rooms[roomID].playing = true;
            io.to(roomID).emit("RoundStart", players);
        });
        
        socket.on("UpdateMe", (data) =>{
            let room = rooms[data.room];
            let players = room.sockets;
            let p = players[socket.id];
            p.x = data.x;
            p.y = data.y;
        });

        socket.on("update",(roomID) => {
            let room = rooms[roomID];
            let players = room.sockets;
            io.to(roomID).emit("updateGame",players);
        });
});
