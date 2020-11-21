export default class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(x,y,scene,texture,username,socket){
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

    }

    configAABB(config){
        this.setSize(config.x,config.y).setOffset(config.OffsetX,config.OffsetY);
        this.setCollideWorldBounds(config.bounds);
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
            y: this.y
        }
        if(this.socket == null){
            this.socket.emit("POSITION_CHANGE", data);
            this.socket.on("UPDATE", (data) =>{
                this.x = data.x;
                this.y = data.y;
            });
        }
    } 
} 