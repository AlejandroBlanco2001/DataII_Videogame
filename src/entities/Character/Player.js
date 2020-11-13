export default class Player extends Phaser.GameObjects.Sprite{
    constructor(x,y,scene,texture,username){
        super({
            x: x,
            y: y,
            scene: scene,
            texture: texture
        });
        this.username = username;
    }
}