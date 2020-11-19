export default class spikeBall extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene,x,y,texture);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.world.enableBody(this);

        this.body.velocity.setTo(200,200);

        // AABB and Size
        this.setCollideWorldBounds(true); 
        
        this.setScale(0.2);
        this.body.setCircle(190);

        this.setAngularVelocity(54);
        this.body.bounce.set(1);
    }

    faster(){
        if(this.angularV <= 1000){
            this.angularV += 50;
            this.setAngularVelocity(this.angularV);
        }
    }
}