const express = require('express');
const RoomManager = require('./models/RoomManager');
const utils = require('./utils');
const path = require('path')
const webpack = require('webpack');
const cors = require('cors');
const webpackDevMiddleware = require('webpack-dev-middleware');
const app = express();
const socket = require('socket.io');
const config = require('../../webpack/base.js');
const { callbackify } = require('util');
const { Console } = require('console');
const Room = require('./models/Room');
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
    res.sendFile(path.join(__dirname,"index.html"));
})

io.on("connection", (socket) => {
    RoomManager.onConnection(io,socket);
});
