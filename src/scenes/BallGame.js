import Player from "../entities/Character/Player";
import SpikeBall from "../entities/Statics/spikeBall";

export default class BallGame extends Phaser.Scene{
    constructor(){
        super({
            key: "BallGame",
            active: false
        });
        this.player;
        this.spikeBall;
    }

    init(data){
        this.roomID = data.roomID;
        this.username = data.username;
        this.server = data.server;
        this.host = data.host;
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
        this.player = new Player(400,400,this,"drake",this.username);
        let spikeBallMap = this.add.tilemap("spikeBallMap");
        this.terrain = spikeBallMap.addTilesetImage("sci-fi-tileset","terrain");
        this.spikeBall = new SpikeBall(this,400,400,"spike");

        this.keyboard = this.input.keyboard.addKeys("W, A, S, D");

        // layers 
        let topLayer = spikeBallMap.createStaticLayer("bot", [this.terrain], 0, 0).setDepth(-1);
        let botLayer = spikeBallMap.createStaticLayer("top", [this.terrain], 0, 0);
        let spikeBallLayer = spikeBallMap.createStaticLayer("BoxPattern",[this.terrain], 0, 0).setDepth(-2);
        
        //map collisions with Player and SpikeBall
        this.physics.add.collider(this.player, botLayer);
        botLayer.setCollisionByProperty({
            collides: true
        });

        this.physics.add.collider(this.player, topLayer);
        topLayer.setCollisionByProperty({
            collides: true
        });

        this.physics.add.collider(this.spikeBall,spikeBallLayer, () =>{
            this.spikeBall.faster();
        });

        spikeBallLayer.setCollisionByProperty({
            hitByBall: true
        })

        // collisions with player and spikeBall
        this.physics.add.collider(this.player,this.spikeBall, () =>{
            this.player.destroy();
        });s

        /*
        const debugGraphics = this.add.graphics().setAlpha(0.7);

        topLayer.renderDebug(debugGraphics,{
            tileCOlor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234,48,255),
            faceColor: new Phaser.Display.Color(43,39,37,255)
        });
        */
       
    }

    update(time, delta){
        if(this.player.active){
            this.player.update(this.keyboard);
        }
    }


}
