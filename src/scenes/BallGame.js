import io from 'socket.io-client';
import Player from '../entities/Character/Player';
var spike;

export default class BallGame extends Phaser.Scene{
    constructor(){
        super({
            key: "BallGame",
            active: false
        });
    }

    init(data){
        this.scene.active = true;
    }
    
    preload(){
        this.load.image("terrain", "src/assets/images/sci-fi-tileset.png");
        this.load.tilemapTiledJSON("spikeBallMap","src/assets/map/spikeBallMap.json");
    }

    create(){
        let spikeBallMap = this.add.tilemap("spikeBallMap");
        this.terrain = spikeBallMap.addTilesetImage("sci-fi-tileset","terrain");
        
        // layers 
        let botLayer = spikeBallMap.createStaticLayer("bot", [this.terrain],0,0).setDepth(-1);
        let topLayer = spikeBallMap.createStaticLayer("top", [this.terrain],0,0);
   
        this.player = new Player();
    }

    update(){
    }


}