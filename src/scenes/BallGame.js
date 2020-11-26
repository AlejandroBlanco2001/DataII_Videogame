import Player from "../entities/Character/Player";
import SpikeBall from "../entities/Statics/spikeBall";
var availableSkins = ["red","blue","yellow","green"];


/**
 * Representacion del Front End del juego
 */
export default class BallGame extends Phaser.Scene{
    constructor(){
        super({
            key: "BallGame",
            active: false
        });
        this.player;
        this.playerObjects = {};
        this.lastDead;
        this.spikeBall;
        this.updateT = false;
        this.skin = availableSkins[Math.floor(Math.random() * 4)];
    }
    
    init(data){
        this.roomID = data.roomID;
        this.username = data.username;
        this.server = data.server;
        this.host = data.host;
    }

    /**
     * Metodo que se encarga de verificar si el juego ha finalizado
     */
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
        var skinName = this.skin;
        
        // images 
        this.load.spritesheet("drake", "src/assets/images/SpriteSheets/"+skinName+".png", {frameWidth: 24, frameHeight: 24});
        this.load.image("spike","src/assets/images/Statics/spikeBall.png");

        this.textures.addSpriteSheetFromAtlas();

        this.load.image("terrain", "src/assets/images/sci-fi-tileset.png");
        this.load.tilemapTiledJSON("spikeBallMap","src/assets/map/spikeBallMap.json");

        // sounds
        this.load.audio("die", "src/assets/sounds/diePlayer.ogg", "src/assets/sounds/diePlayer.mp3");
        this.load.audio("crash", "src/assets/sounds/impactWall.ogg", "src/assets/sounds/impactWall.mp3");

        this.server.emit("gameStart", this.roomID);
        // Se encarga de crear los jugadores recibidos por el servidor
        this.server.on("PLAYERS", (dataPlayers, spikeRoom) => {
            if(!notDuplicate){
                for(var key in dataPlayers){
                    let p = dataPlayers[key];
                    let user = p.username;
                    console.log(user);
                    var x = p.x;
                    var y = p.y;
                    if(user == this.username){
                        this.player = new Player(x,y,this,"drake",user,this.server,this.roomID,0);
                        this.playerObjects[user] = this.player;
                    }else{
                        let character = new Player(x,y,this,"drake",user,p.id,this.roomID,0);
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
        this.keyboard = this.input.keyboard.addKeys("W, A, S, D");

        let spikeBallMap = this.add.tilemap("spikeBallMap");
        this.terrain = spikeBallMap.addTilesetImage("sci-fi-tileset","terrain");

        // sounds 
        this.dieSound = this.sound.add("die");
        this.crashSound = this.sound.add("crash");

        // layers 
        let topLayer = spikeBallMap.createStaticLayer("bot", [this.terrain], 0, 0).setDepth(-1);
        let botLayer = spikeBallMap.createStaticLayer("top", [this.terrain], 0, 0);
        let spikeBallLayer = spikeBallMap.createStaticLayer("BoxPattern",[this.terrain], 0, 0).setDepth(-2);
        
        // set texture to player because server loading 
        this.player.setTexture('drake',0);
        this.spikeBall.setTexture("spike");

        //map collisions with Player and SpikeBall
        for(var key in this.playerObjects){
            this.playerObjects[key].setTexture("drake",0);
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
                this.lastDead = p.getUsername();
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

        this.anims.create({
            key : "rightWalk",
            frameRate: 15,
            frames: this.anims.generateFrameNumbers('drake', {
                frames: [   ,18,19,20,21,22,23]
            })
        });
                
        this.anims.create({
            key : "jumping",
            frameRate: 15,
            frames: this.anims.generateFrameNumbers('drake', {
                frames: [8,9]
            })
        })

        this.anims.create({
            key : "SS",
            frameRate: 15,
            frames: this.anims.generateFrameNumbers('drake', {
                frames: [0,1,2,3]
            })
        });

        // Metodo que se encarga de actualizar las posiciones del jugador 
        this.server.on("UPDATE", (players) => {
            for(var key in players){
                let pServer = players[key];
                let data = {room: this.roomID, x: pServer.x, y: pServer.y};
                this.playerObjects[pServer.username].updateCoords(data);
            }
        });

        // Metodo que se encarga de actualizar la posicion de la spike
        this.server.on("SPIKE_UPDATE", spike => {
            if(spike != null){
                let data = {x: spike.x, y: spike.y};
                this.spikeBall.updateCoords(data);
            }
        });
        
        window.player = this.player;
    }

    checkAnimation(){
        console.log(this.player.frame);
        if(this.keyboard.D.isDown){
            this.player.play("rightWalk", true);
            console.log("ACA");
        }
        if(this.keyboard.A.isDown){
            this.player.anims.playReverse("rightWalk",true);
        }
        if(this.keyboard.W.isDown && this.player.body.blocked.down){  
            this.player.play("jumping",true);
        }   
        if(this.keyboard.A.isUp && this.keyboard.D.isUp){ // Not moving x 
            this.player.play("SS",true);
        }
    }

    update(){
        if(this.player.active){
            this.player.update(this.keyboard);
            this.checkAnimation();
        }
        
        if(this.gameOver()){
            this.server.emit("GAME_OVER",this.roomID);
        }
        
        // Intervalo que se encarga de actualizar periodicamente cada 0.01 segundos la posicion de la spike
        setInterval(() =>{
            if(this.spikeBall.updatePos() != false){
                let data = this.spikeBall.getNewPos();
                let roomID = this.roomID;
                let r = "roomID";
                data[r] = roomID;
                this.server.emit("UPDATE_SPIKE",data)
            }
        },100);

        // Se encarga de dar por terminada por la partida y devolver al Lobby
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
