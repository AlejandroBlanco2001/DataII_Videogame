import io from 'socket.io-client';

export default class Lobby extends Phaser.Scene{
    constructor(){
        super({
            key: 'Lobby',
            active: false
        });
    }

    init(roomId,server){
        this.roomId = roomId;
        this.server = server;
        this.scene.active = true;
    }

    preload(){

    }

    create(){
        this.cursorKeys = this.input.keyboard.createCursorKeys();
    }

    update(){
        this.server.on("Welcome", (msg) => console.log(msg));
    }

}