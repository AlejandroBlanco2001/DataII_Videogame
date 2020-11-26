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
        this.load.audio("waitMusic", "src/assets/music/lobbyWait.ogg","src/assets/music/lobbyWait.mp3");
    }

    create(){
        this.font = {
            fontFamily : "Georgia"
        }
        this.players = "";
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        let musicConfig = {
            mute: false,
            volume: 0.5,
            loop: true,
            delay: 0
        }

        this.music = this.sound.add("waitMusic");
        this.music.play(musicConfig);

        this.server.on("RefreshLobby", (players) => {
            this.players = players;
        });
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

        this.server.on("RoundStart",() => {
            if(this.scene.isActive()){
                let data = {
                    username: this.username,
                    server: this.server,
                    roomID: this.roomId,
                    host: this.host
                }
                this.music.stop();
                this.scene.start("BallGame",data);
                this.scene.start("BallGameUI");
                this.scene.setActive(false);
                this.scene.stop("Lobby");
            }
        });
    }
} 