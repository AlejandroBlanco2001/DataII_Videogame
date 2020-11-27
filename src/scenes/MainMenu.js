import io from 'socket.io-client';
/**
 * Representacion del Menu
 */

/**
  * Valores entre Escenas
  * @typedef {Object} JSON_SCENES
  * @property {number} id - ID de la Sala
  * @property {Socket} socket - Socket del cliente
  * @property {string} username - Nombre de usuario del cliente
  * @property {string} [host] - ID del socket que es host de la partida
*/

export default class MainMenu extends Phaser.Scene{
    /**
     * Constructor
     */
    constructor(){
        super({
            key: 'MainMenu',
            active: false
        });
    }

    
    preload(){
        this.load.audio("music", "src/assets/music/gameMusic.ogg","src/assets/music/gameMusic.mp3");
        this.load.image("fondo","./src/scenes/menu/fondo.png");
    }

    create(){
        
        this.add.image(0, 50, "fondo").setScale(0.7).setOrigin(0,0);

        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.server = io();
        this.add.text(120, 120,"Move quick or Die", {fontFamily:'prueba',fontSize:100,color:"#E0C926",});
        const Broom = this.add.text(285,370, "Create a Room", {fontFamily:'prueba',color:"#948100",fontSize:70}).setInteractive();
        Broom.once("pointerdown",()=>this.Nuevo()); // Condicion para que el cliente genere una sala

        const Oroom= this.add.text(370,480, "Join Room ", {fontFamily:'prueba',color:"#948100",fontSize:70}).setInteractive();
        Oroom.once("pointerdown",()=>this.Unir());// Condicion para ingresar un cliente en una sala

        
        this.username = prompt("Ingresa su nombre de usuario");

        let musicConfig = {
            mute: false,
            volume: 0.5,
            loop: true,
            delay: 0
        }

        this.musicMenu = this.sound.add("music");
        this.musicMenu.play(musicConfig);
    }
    Nuevo(){
        this.server.emit("createRoom",this.username);
    }
    Unir(){
        if(!this.already){
            let room = prompt("Ingresa la sala a ingresar");
            if(room != null){
                this.server.emit("joinRoom",room,this.username);
                this.already = true;
            }
        }
    }

    update(){
        
        //Metodo que se encarga de crear la sala por parte del host
        this.server.on("createdRoom", (roomID) => {
            if(this.scene.isActive()){
                let socketID = this.server;
                /**
                 * @type {JSON_SCENES} 
                 */
                let data = {
                    id: roomID,
                    socket: socketID,
                    username: this.username
                }
                this.scene.launch("Lobby", data);
                this.musicMenu.stop();
                this.scene.setActive(false);
                this.scene.stop();
            }
        });
        this.server.on("roomsAv", (msg) => console.log(msg));
    }
}