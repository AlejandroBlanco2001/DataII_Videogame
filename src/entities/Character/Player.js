export default class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(x,y,scene,texture,username,socket, roomID){
        super(scene,x,y,texture);

        // Connect with the scene
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.world.enableBody(this);

        this.username = username;
        // AABB and Size
        this.setScale(2);
        this.setSize(15,15).setOffset(5,5);
        this.setCollideWorldBounds(true);  

        // Debug parameters


        // Server-Side usefull things        
        this.socket = socket;
        this.roomID = roomID;

    }

    configAABB(config){
        this.setSize(config.x,config.y).setOffset(config.OffsetX,config.OffsetY);
        this.setCollideWorldBounds(config.bounds);
    }
    
    updateCoords(coords){
        this.x = coords.x;
        this.y = coords.y;
    }

    update(keyboard){
        if(keyboard.D.isDown){
            this.setVelocityX(124);
        }
        if(keyboard.A.isDown){
            this.setVelocityX(-124);
        }
        if(keyboard.S.isDown){
            this.setVelocityY(64);
        }
        if(keyboard.W.isDown && this.body.blocked.down){  
            this.setVelocityY(-200);
        }   
        if(keyboard.A.isUp && keyboard.D.isUp){ // Not moving x 
            this.setVelocityX(0); 
        }
        let data = {
            x: this.x,
            y: this.y,
            roomID: this.roomID
        }
        if(this.socket != null){
            this.socket.emit("POSITION_CHANGE", data);
        }
    } 
} 