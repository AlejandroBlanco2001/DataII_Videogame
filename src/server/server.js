// Dependencies
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const cors = require('cors');
const webpackDevMiddleware = require('webpack-dev-middleware');
const app = express();
const socket = require('socket.io');
const config = require('../../webpack/base.js');
const { callbackify } = require('util');
const { Console } = require('console');
const compiler = webpack(config);
const RoomManager = require('./models/RoomManager');
var PORT = process.env.PORT || 5000;

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

/**
 * Servidor de HTTP que escucha la ventana
 */
const server = app.listen(PORT, () =>{
    console.log("Listening on " + PORT);
})

/**
 * Declaracion del servidor de sockets
 */
const io = socket(server);

/**
 * Metodo que devuelve el HTML del juego
 */
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname,"index.html"));
})

/**
 * Metodo que se encarga de tomar las conexiones de los clientes
 */
io.on("connection", (socket) => {
    RoomManager.onConnection(io,socket);
});
