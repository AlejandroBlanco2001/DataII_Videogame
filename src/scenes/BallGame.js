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


    preload(){
        var notDuplicate = false;
        this.load.spritesheet("drake", "src/assets/images/SpriteSheets/blue.png",{framHeight: 24, frameWidth: 24});
        this.load.image("spike","src/assets/images/Statics/spikeBall.png");

        this.load.image("terrain", "src/assets/images/sci-fi-tileset.png");
        this.load.tilemapTiledJSON("spikeBallMap","src/assets/map/spikeBallMap.json");

        this.server.emit("gameStart", this.roomID);
        this.server.on("PLAYERS", (dataPlayers) => {
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
            }
            notDuplicate = true;
        });        
    }

    create(){            

        this.keyboard = this.input.keyboard.addKeys("W, A, S, D");

        let spikeBallMap = this.add.tilemap("spikeBallMap");
        this.terrain = spikeBallMap.addTilesetImage("sci-fi-tileset","terrain");
        this.spikeBall = new SpikeBall(this,600,400,"spike");

        // layers 
        let topLayer = spikeBallMap.createStaticLayer("bot", [this.terrain], 0, 0).setDepth(-1);
        let botLayer = spikeBallMap.createStaticLayer("top", [this.terrain], 0, 0);
        let spikeBallLayer = spikeBallMap.createStaticLayer("BoxPattern",[this.terrain], 0, 0).setDepth(-2);
        
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
            /*
            this.physics.add.overlap(p,this.spikeBall, () =>{
                p.destroy();
            });
            */
        }

        this.physics.add.collider(this.spikeBall,spikeBallLayer, () =>{
            this.spikeBall.faster();
        });

        spikeBallLayer.setCollisionByProperty({
            hitByBall: true
        })
    }

    update(){
        if(this.player != null){
            if(this.player.active){
                this.player.update(this.keyboard);
            }
        }
        this.server.on("UPDATE", (players) => {
            for(var key in players){
                let pServer = players[key];
                let data = {x: pServer.x, y: pServer.y};
                this.playerObjects[pServer.username].updateCoords(data);
                console.log("ACTUALIZADO");
            }
        });
    }
}
