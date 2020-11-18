import Player from "../entities/Character/Player";

export default class BallGame extends Phaser.Scene{
    constructor(){
        super({
            key: "BallGame",
            active: false
        });
        this.player;
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

        this.load.image("terrain", "src/assets/images/sci-fi-tileset.png");
        this.load.tilemapTiledJSON("spikeBallMap","src/assets/map/spikeBallMap.json");
    }

    create(){
        this.player = new Player(400,400,this,"drake",this.username);
        let spikeBallMap = this.add.tilemap("spikeBallMap");
        this.terrain = spikeBallMap.addTilesetImage("sci-fi-tileset","terrain");
        

        this.keyboard = this.input.keyboard.addKeys("W, A, S, D");
        // layers 
        let topLayer = spikeBallMap.createStaticLayer("bot", [this.terrain], 0, 0).setDepth(-1);
        let botLayer = spikeBallMap.createStaticLayer("top", [this.terrain], 0, 0);
   
        //map collisions
        this.physics.add.collider(this.player, botLayer);
        botLayer.setCollisionByProperty({
            collides: true
        });

        this.physics.add.collider(this.player, topLayer);
        topLayer.setCollisionByProperty({
            collides: true
        });

        const debugGraphics = this.add.graphics().setAlpha(0.7);

        /* DEBUG GRAPHICS
        topLayer.renderDebug(debugGraphics,{
            tileCOlor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234,48,255),
            faceColor: new Phaser.Display.Color(43,39,37,255)
        });
        */
    }

    update(time, delta){
        this.player.update(this.keyboard);
    }


}
