/**
 * Representacion del Lobby
 */

/**
  * Valores entre Escenas
  * @typedef {Object} JSON_SCENES
  * @property {number} id - ID de la Sala
  * @property {Socket} socket - Socket del cliente
  * @property {string} username - Nombre de usuario del cliente
  * @property {string} [host] - ID del socket que es host de la partida
*/

export default class Lobby extends Phaser.Scene{
    /**
     * Constructor
     */
    constructor(){
        super({
            key: 'Lobby',
        });
        this.host;
    }

    /**
     * Inicializador de escena
     * @param {JSON_SCENES} data Informacion entre escenas 
     */
    init(data){
        this.roomId = data.id;
        this.server = data.socket;
        this.username = data.username;
    }

    preload(){
        this.load.audio("waitMusic", "src/assets/music/lobbyWait.ogg","src/assets/music/lobbyWait.mp3");
    }

    create(){
        this.font = {
            fontFamily : "Georgia"
        }
        this.players = "";
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        let musicConfig = {
            mute: false,
            volume: 0.5,
            loop: true,
            delay: 0
        }

        this.music = this.sound.add("waitMusic");
        this.music.play(musicConfig);

        // Metodo que se encarga de refrescar los nombres de los jugadores
        this.server.on("RefreshLobby", (players) => {
            this.players = players;
        });

    }

    update(){
        this.add.text(640,300, "Room: " + this.roomId, this.font);
        this.add.text(500,300, "In the room are" + "\n" + this.players, this.font);
        
        // Verifica si el host desea iniciar la partida
        if(this.cursorKeys.space.isDown){
            this.server.emit("isLeader", this.roomId);
            this.server.on("Leader", (host) =>{
                if(host){    
                    this.host = this.server.id;
                    this.server.emit("StartGame", this.roomId);
                } 
            });
        }

        // Metodo que se encarga de iniciar la partida por parte del servidor
        this.server.on("RoundStart",() => {
            if(this.scene.isActive()){
                /**
                 * @type {JSON_SCENES}
                 */
                let data = {
                    username: this.username,
                    server: this.server,
                    roomID: this.roomId,
                    host: this.host
                }
                this.music.stop();
                this.scene.start("BallGame",data);
                this.scene.setActive(false);
                this.scene.stop("Lobby");
            }
        });
    }
} 