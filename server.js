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

app.get('/', (req,res) =>{
    console.log("Lo corri");
    res.sendFile(path.join(__dirname,"/index.html"));
})

const joinRoom = (socket, room) => {
    room.sockets.push(socket);
    socket.join(room.id, () =>{
        socket.roomId = room.id;
        console.log(socket.id, "Joined", room.id);
    });
};

io
    .of("/")
    .on("connection", (socket) => {

        socket.emit("welcome", "Hello and Welcome to the Socket.io Server");
        console.log("SOMEONE IS IN THE SOCKET");    

        socket.on("createRoom", () => {
            let name = utils.generateRandomID();
            console.log(name);
            const room = {
                id: name,
                name: uuid.v1(),
                sockets: []
            };
            rooms[room.id] = room;
            joinRoom(socket,room);
            socket.emit("createdRoom",name);
        });

        socket.on("joinRoom", (roomId) =>{
            const room = rooms[roomId];
            joinRoom(socket,room);
        })
});
