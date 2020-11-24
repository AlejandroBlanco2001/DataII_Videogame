import Player from "../entities/Character/Player";
import SpikeBall from "../entities/Statics/spikeBall";

export default class BallGame extends Phaser.Scene{
    constructor(){
        super({
            key: "BallGame",
            active: false
        });
        this.player;
        this.playerObjects = {};
        this.spikeBall;
        this.updateT = false;
    }
    
    init(data){
        this.roomID = data.roomID;
        this.username = data.username;
        this.server = data.server;
        this.host = data.host;
    }

    gameOver(){
        for(var key in this.playerObjects){
            let Player = this.playerObjects[key];
            if(Player.active){
                return false;
            }
        }
        return true;
    }


    preload(){
        var notDuplicate = false;
        var onlyOneTime = false;
        
        // images 
        this.load.spritesheet("drake", "src/assets/images/SpriteSheets/blue.png",{framHeight: 24, frameWidth: 24});
        this.load.image("spike","src/assets/images/Statics/spikeBall.png");

        this.load.image("terrain", "src/assets/images/sci-fi-tileset.png");
        this.load.tilemapTiledJSON("spikeBallMap","src/assets/map/spikeBallMap.json");

        // sounds
        this.load.audio("die", "src/assets/sounds/diePlayer.ogg", "src/assets/sounds/diePlayer.mp3");
        this.load.audio("crash", "src/assets/sounds/impactWall.ogg", "src/assets/sounds/impactWall.mp3");

        this.server.emit("gameStart", this.roomID);
        this.server.on("PLAYERS", (dataPlayers, spikeRoom) => {
            if(!notDuplicate){
                for(var key in dataPlayers){
                    let p = dataPlayers[key];
                    let user = p.username;
                    console.log(user);
                    var x = p.x;
                    var y = p.y;
                    if(user == this.username){
                        this.player = new Player(x,y,this,"drake",user,this.server,this.roomID);
                        this.playerObjects[user] = this.player;
                    }else{
                        let character = new Player(x,y,this,"drake",user,p.id,this.roomID);
                        this.playerObjects[user] = character;
                    }
                }
                if(!onlyOneTime){
                    this.spikeBall = new SpikeBall(this,spikeRoom.x,spikeRoom.y,"spike");
                    onlyOneTime = true;
                }
            }
            notDuplicate = true;
        });        
    }

    create(){            
        var onlyOneTime = false;
        this.keyboard = this.input.keyboard.addKeys("W, A, S, D");

        let spikeBallMap = this.add.tilemap("spikeBallMap");
        this.terrain = spikeBallMap.addTilesetImage("sci-fi-tileset","terrain");
        // sounds 

        this.dieSound = this.sound.add("die");
        this.crashSound = this.sound.add("crash");

        // music

        // layers 
        let topLayer = spikeBallMap.createStaticLayer("bot", [this.terrain], 0, 0).setDepth(-1);
        let botLayer = spikeBallMap.createStaticLayer("top", [this.terrain], 0, 0);
        let spikeBallLayer = spikeBallMap.createStaticLayer("BoxPattern",[this.terrain], 0, 0).setDepth(-2);
        
        // set texture to player because server loading 
        this.player.setTexture("drake");

        //map collisions with Player and SpikeBall
        for(var key in this.playerObjects){
            this.playerObjects[key].setTexture("drake");
            let p = this.playerObjects[key];
            
            this.physics.add.collider(p, botLayer);
            botLayer.setCollisionByProperty({
                collides: true
            });

            this.physics.add.collider(p, topLayer);
            topLayer.setCollisionByProperty({
                collides: true
            });

            // collisions with player and spikeBall
            this.physics.add.overlap(p,this.spikeBall, () =>{
                //p.destroy();
                //this.dieSound.play();
            });

            this.physics.add.collider(this.spikeBall,spikeBallLayer, () =>{
                this.spikeBall.faster();
                this.crashSound.play();
            });
    
            spikeBallLayer.setCollisionByProperty({
                hitByBall: true
            })        
        }

        this.server.on("UPDATE", (players) => {
            for(var key in players){
                let pServer = players[key];
                let data = {room: this.roomID, x: pServer.x, y: pServer.y};
                this.playerObjects[pServer.username].updateCoords(data);
            }
        });
    }

    update(){
        if(this.player != null){
            if(this.player.active){
                this.player.update(this.keyboard);
            }
        }
        if(this.gameOver()){
            this.server.emit("GAME_OVER",this.roomID);
        }
        setInterval(() =>{
            if(this.spikeBall.updatePos() !== false){
                let roomID = this.roomID;
                let r = "roomID";
                let data = this.spikeBall.updatePos();
                data[r] = roomID;
                this.server.emit("UPDATE_SPIKE",data)
            }
        },100);
        this.server.on("LOBBY", () => {
            if(this.scene.isActive()){
                let data = {
                    id: this.roomID,
                    socket: this.server,
                    username: this.username
                }
                this.scene.start("Lobby",data);
                this.scene.setActive(false);
                this.scene.stop("BallGame");
            }
        });
    }
}
