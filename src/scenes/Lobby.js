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
        this.server.emit("FindHost", this.roomId);
        this.players = "";
        this.already = false;
        this.server.on("Host", (verification) =>{
            if(verification == true){
                this.host = true;
            }else{
                this.host = false;
            }
        });
        this.cursorKeys = this.input.keyboard.createCursorKeys();
    }

    update(){
        this.add.text(640,300, "You are the host" + this.host, this.font);
        this.add.text(100,100,this.players,this.font);
        
        if(this.cursorKeys.space.isDown && this.host && !this.already){
            this.server.emit("StartGame", this.roomId);
            this.alreayd = true;
        }

        this.server.on("RefreshLobby", (players) => {
            this.players = players;
        });

        this.server.on("RoundStart",(msg) => {
            if(this.scene.isActive()){
                let data = {
                    username: this.username,
                    server: this.server,
                    roomID: this.roomID,
                    host: this.host
                }
                this.scene.start("BallGame",data);
                this.scene.setActive(false);
                this.scene.stop("Lobby");
            }
        });
    }
} 