const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const config = require('./webpack/base.js');
const PORT = process.env.PORT || 5000;
const compiler = webpack(config);

app.use("/src", express.static('./src/'));
app.use("/phaser", express.static("./node_modules/phaser/"));

app.use(webpackDevMiddleware(compiler,{
    publicPath: config.output.publicPath,
}));

app.get('/', (req,res) =>{
    console.log("Lo corri");
    res.sendFile(path.join(__dirname,"/index.html"));
})

app.listen(PORT, () =>{
    console.log("Listening on ${server.address().port}")
})
