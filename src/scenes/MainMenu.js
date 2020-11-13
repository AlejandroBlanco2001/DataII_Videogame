import io from 'socket.io-client';

export default class MainMenu extends Phaser.Scene{
    constructor(){
        super({
            key: 'MainMenu',
            active: true
        });
    }

    
    preload(){
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.server = io("https://move-quick-or-die.herokuapp.com/");
        this.already = false;
    }

    create(){
        let font = {
            fontFamily : "Georgia"
        }
        this.add.text(640, 100,"Move quick or Die", font);
        this.add.text(640,300, "Create a Room", font);
        this.add.text(640,360, "Join Room", font);
        this.username = prompt("Ingresa su nombre de usuario");
    }

    update(){
        if(this.cursorKeys.down.isDown){
            console.log("entre");
            this.server.emit("createRoom",this.username);
        }
        if(this.cursorKeys.space.isDown && !this.already){
            let room = prompt("Ingresa la sala a ingresar");
            if(room != null){
                this.server.emit("joinRoom",room,this.username);
                this.already = true;
            }
        }
        this.server.on("createdRoom", (roomID) => {
            let socketID = this.server;
            let data = {
                id: roomID,
                socket: socketID,
                username: this.username
            }
            this.scene.start("Lobby", data);
            this.scene.stop("MainMenu");
        });
        this.server.on("roomsAv", (msg) => console.log(msg));
    }
}