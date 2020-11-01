
import io from 'socket.io-client';

export default class MainMenu extends Phaser.Scene{
    constructor(){
        super({
            key: 'MainMenu',
            active: true
        });
    }

    preload(){
    }

    create(){
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.server = io("http://127.0.0.1:5000/");
        this.already = false;
    }

    update(){
        if(this.cursorKeys.down.isDown){
            console.log("entre");
            this.server.emit("createRoom");
        }
        if(this.cursorKeys.space.isDown && !this.already){
            let room = prompt("Ingresa la sala a ingresar");
            this.server.emit("joinRoom",room);
            this.already = true;
        }

        this.server.on("createdRoom", (roomID) => {
            this.scene.start("Lobby", roomID,this.server);
            this.scene.stop("MainMenu");
        });

        this.server.on("Welcome", (msg) => console.log(msg));
        this.server.on("roomsAv", (msg) => console.log(msg));
    }

}