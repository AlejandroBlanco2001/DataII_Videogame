/**
 * Representacion del jugador
 */
export default class Player extends Phaser.Physics.Arcade.Sprite{
    /**
     * Constructor
     * @param {number} x Coordenada en X 
     * @param {number} y Coordenada en Y
     * @param {Phaser.Scene} scene Escena del juego
     * @param {string} texture Textura del jugador 
     * @param {string} username Nombre del jugador 
     * @param {Socket} socket Socket del jugador 
     * @param {string} roomID ID de la sala del jugador
     * @param {number} frame Frame del personaje con respecto al Spritesheet 
     */
    constructor(x,y,scene,texture,username,socket, roomID,frame){
        super(scene,x,y,texture,frame);

        // Connect with the scene
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.world.enableBody(this);

        this.username = username;

        // animations usefull things
        this.orientation = "right";

        // AABB and Size
        this.setScale(2);
        this.setSize(15,15).setOffset(5,5);
        this.setCollideWorldBounds(true);  

        // Server-Side usefull things        
        this.socket = socket;
        this.roomID = roomID;
        this.oldPositions = {
            x : this.x,
            y : this.y
        };
    }

    /**
     * Metodo que se encarga de retornar la direccion de la animación
     */
    getOrientation(){
        return this.orientation;
    }

    /**
     * Metodo que devuelve el nombre del usuario
     */
    getUsername(){
        return this.username;
    }

    /**
     * Metodo que se encarga de verificar la caja AABB de colisiones
     * @param {JSON} config 
     */
    configAABB(config){
        this.setSize(config.x,config.y).setOffset(config.OffsetX,config.OffsetY);
        this.setCollideWorldBounds(config.bounds);
    }
    
    /**
     * Metodo que se encarga de actualizar los datos de las coordenadas del jugador
     * @param {JSON} coords 
     */
    updateCoords(coords){
        this.x = coords.x;
        this.y = coords.y;
    }

    /**
     * Metodo que se encarga de llamarse periodicamente para el movimiento del juego
     * @param {Phaser.Input.keyboard} keyboard 
     */
    update(keyboard){
        var data;
        if(keyboard.D.isDown){
            if(this.orientation != "right"){
                this.flipX = false;
                this.orientation = "right";
            }
            this.setVelocityX(124);
        }
        if(keyboard.A.isDown){
            if(this.orientation != "left"){
                this.flipX = true;
                this.orientation = "left";
            }
            this.setVelocityX(-124);
        }
        if(keyboard.W.isDown && this.body.blocked.down){  
            this.setVelocityY(-200);
        }   
        if(!this.body.touching.down){
        }
        if(keyboard.A.isUp && keyboard.D.isUp){ // Not moving x 
            this.setVelocityX(0); 
        }
        /**
         * Llamada periodica cada 0.40 segundos para actualizar la posicion del jugador
         */
        setInterval(() =>{
            data = {room: this.roomID, x: this.x, y: this.y}
            if(this.oldPositions && (this.x !== this.oldPositions.x || this.y !== this.oldPositions.y)){
                this.socket.emit("POSITION_CHANGE",data);
                this.oldPositions = {
                    x: this.x,
                    y: this.y
                }
            }
        },400);
    } 
} 