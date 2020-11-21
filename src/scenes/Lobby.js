export default class Lobby extends Phaser.Scene{
    constructor(){
        super({
            key: 'Lobby',
        });
    }

    init(data){
        this.roomId = data.id;
        this.server = data.socket;
        this.username = data.username;
    }

    preload(){
      
    }

    create(){
        console.log("LOBBY");
        this.font = {
            fontFamily : "Georgia"
        }
        this.players = "";
        this.already = false;
        this.cursorKeys = this.input.keyboard.createCursorKeys();
    }

    update(){
        this.add.text(640,300, "Room: " + this.roomId, this.font);
        this.add.text(500,300, "In the room are" + "\n" + this.players, this.font);
        
        if(this.cursorKeys.space.isDown){
            this.server.emit("isLeader", this.roomId);
            this.server.on("Leader", (host) =>{
                if(host){    
                    this.server.emit("StartGame", this.roomId);
                } 
            });
        }

        this.server.on("RefreshLobby", (players) => {
            this.players = players;
        });

        this.server.on("RoundStart",() => {
            if(this.scene.isActive()){
                let data = {
                    username: this.username,
                    server: this.server,
                    roomID: this.roomId,
                    host: this.host
                }
                this.server.emit("SwitchServer", this.roomId);
                this.scene.start("BallGame",data);
                this.scene.setActive(false);
                this.scene.stop("Lobby");
            }
        });
    }
} 