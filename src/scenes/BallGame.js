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
        this.player = this.physics.add.sprite(400,400,"drake").setScale(2);
        let spikeBallMap = this.add.tilemap("spikeBallMap");
        this.terrain = spikeBallMap.addTilesetImage("sci-fi-tileset","terrain");
        

        this.keyboard = this.input.keyboard.addKeys("W, A, S, D");
        // layers 
        let botLayer = spikeBallMap.createStaticLayer("bot", [this.terrain],0,0).setDepth(-1);
        let topLayer = spikeBallMap.createStaticLayer("top", [this.terrain],0,0);
   
    }

    update(time, delta){
        if(this.keyboard.D.isDown){
            console.log("MOVE");
            this.player.setVelocityX(24);
        }

        if(this.keyboard.A.isDown){
            this.player.setVelocityX(-24);
        }

        if(this.keyboard.S.isDown){
            this.player.setVelocityY(-24);
        }

        if(this.keyboard.W.isDown){
            this.player.setVelocityY(24);
        }
        
        if(this.keyboard.A.isUp && this.keyboard.D.isUp){ // Not moving x 
            this.player.setVelocityX(0);
        }

        if(this.keyboard.W.isUp && this.keyboard.S.isUp){ // Not moving y 
            this.player.setVelocityY(0);
        }
    }


}
