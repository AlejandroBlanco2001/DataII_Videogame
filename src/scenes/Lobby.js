import io from 'socket.io-client';
import Player from "../entities/Character/Player.js"

export default class Lobby extends Phaser.Scene{
    constructor(){
        super({
            key: 'Lobby',
            active: false
        });
    }

    init(data){
        this.roomId = data.id;
        this.server = data.socket;
        this.username = data.username;
        this.scene.active = true;
    }

    preload(){
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.server.emit("FindHost", this.roomId);
        this.players = "";
        this.server.on("Host", (verification) =>{
            if(verification == true){
                this.host = true;
            }else{
                this.host = false;
            }
        });
    }

    create(){
        this.font = {
            fontFamily : "Georgia"
        }
    }

    update(){
        this.add.text(640,300, "You are the host" + this.host, this.font);
        this.add.text(100,100,this.players,this.font);
        
        if(this.cursorKeys.space.isDown && this.host){
            this.server.emit("StartGame", this.roomId) ;
        }

        this.server.on("RefreshLobby", (players) => {
            this.players = players;
        });

        this.server.on("RoundStart",(msg) => {
            this.scene.start("BallGame");
            this.scene.stop("Lobby");
        });
    }
} 