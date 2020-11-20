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
    }

    init(data){
        this.roomID = data.roomID;
        this.username = data.username;
        this.server = data.server;
        this.host = data.host;
        this.players = data.players;
    }
    
    preload(){
        this.anims.create({
            key : "left",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("drake",{
                start: 0,
                end: 10
            })
        });
        
        this.load.spritesheet("drake", "src/assets/images/SpriteSheets/blue.png",{framHeight: 24, frameWidth: 24});
        this.load.image("spike","src/assets/images/Statics/spikeBall.png");

        this.load.image("terrain", "src/assets/images/sci-fi-tileset.png");
        this.load.tilemapTiledJSON("spikeBallMap","src/assets/map/spikeBallMap.json");
    }

    create(){
        for(var key in this.players){
            let p = this.players[key];
            let user = p.username;
            var x = p.x;
            var y = p.y;
            var character;
            if(user == this.username){
                this.player = new Player(x,y,this,"drake",user);
                character = this.player;
            }else{
                character = new Player(x,y,this,"drake",user);
            }
            this.playerObjects[user] = character;
        }
        let spikeBallMap = this.add.tilemap("spikeBallMap");
        this.terrain = spikeBallMap.addTilesetImage("sci-fi-tileset","terrain");
        this.spikeBall = new SpikeBall(this,600,400,"spike");

        this.keyboard = this.input.keyboard.addKeys("W, A, S, D");

        // layers 
        let topLayer = spikeBallMap.createStaticLayer("bot", [this.terrain], 0, 0).setDepth(-1);
        let botLayer = spikeBallMap.createStaticLayer("top", [this.terrain], 0, 0);
        let spikeBallLayer = spikeBallMap.createStaticLayer("BoxPattern",[this.terrain], 0, 0).setDepth(-2);
        
        //map collisions with Player and SpikeBall
        for(var key in this.playerObjects){

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
                p.destroy();
            });
        }

        this.physics.add.collider(this.spikeBall,spikeBallLayer, () =>{
            this.spikeBall.faster();
        });

        spikeBallLayer.setCollisionByProperty({
            hitByBall: true
        })
    }

    update(){
        if(this.player.active){
            this.player.update(this.keyboard);
        }
        let data = {
            room : this.roomID,
            user : this.username,
            x : this.player.x,
            y : this.player.y
        }
        this.server.on("updateGame", (dataPack) =>{
            for(let i = 0; i < dataPack.length; i++){
                this.playersList[dataPack[i].user].setX(dataPack[i].x);
                this.playersList[dataPack[i].user].setY(dataPack[i].y);
            }
        });
        this.server.emit("UpdateMe",data);
        this.server.emit("update", this.roomID);
    }


}
