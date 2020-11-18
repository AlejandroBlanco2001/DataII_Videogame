export default class Player extends Phaser.GameObjects.Sprite{
    constructor(x,y,scene,texture,frame,username){
        super(scene,x,y,texture,frame);
        this.username = username;
    }

    update(){
        
    }
}