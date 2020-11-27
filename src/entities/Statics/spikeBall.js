/**
 * Representacion de la Spike
 */

/**
  * Coordenadas de la entidad
  * @typedef {Object} JSON
  * @property {number} x - Posicion X
  * @property {number} y - Posicion Y
*/

export default class spikeBall extends Phaser.Physics.Arcade.Sprite{
    /**
     * Constructor
     * @param {Phaser.Scene} scene Escena en la que se encuentra 
     * @param {number} x Coordenada en X
     * @param {number} y Coordenada en Y
     * @param {string} texture Textura del sprite  
     */
    constructor(scene,x,y,texture){
        // Sync with scene
        super(scene,x,y,texture);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.world.enableBody(this);
        this.body.velocity.setTo(200,200);

        // AABB and Size
        this.setCollideWorldBounds(true); 
        this.setScale(0.2);
        this.body.setCircle(190);
        this.body.bounce.set(1);

        // Server side usefull things 
        this.oldPositions = {
            x: this.x,
            y: this.y
        }
        this.newPos;
    }

    /**
     * Metodo que se encarga de actualizar
     * @param {JSON} data Coordenadas del jugador 
     */
    updateCoords(data){
        this.x = data.x;
        this.y = data.y;
    }

    /**
     * Metodo que se encarga de obtener las nuevas posiciones
     */
    getNewPos(){
        return this.newPos;
    }

    /**
     * Metodo que se encarga de incrementar la velocidad angular y tangencial de la pelota
     */
    faster(){
        if(this.body.angularVelocity <= 800){
            this.body.angularVelocity += 200;
        }
        this.setVelocityX(this.body.velocity.x + 40);
        this.setVelocityY(this.body.velocity.y - 40);
    }

    /**
     * Metodo que se encarga de actualizar las coordenadas de la Spike
     */
    updatePos(){
        var data = {x: this.x, y: this.y}
        if(this.oldPositions && (this.x !== this.oldPositions.x || this.y !== this.oldPositions.y)){
            this.newPos = data;
            this.oldPositions = {
                x: this.x,
                y: this.y
            }
            return true;            
        }else{
            return false;
        }
    }
}