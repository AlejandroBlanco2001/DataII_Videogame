const BaseModel = require("../util/base-model");

/**
 * Representacion del jugador para el Servidor
 */
class Player extends BaseModel{
    /**
     * Constructor de la clase
     * @param {string} id ID del socket  
     * @param {JSON} position Coordenadas (x,y) del jugador 
     * @param {Boolean} host Host  
     * @param {string} username Nombre de usuario
     */
    constructor(id, position, host,username){
        super(id,position.x,position.y);
        this.host = host;
        this.username = username;
    }

    /**
     * Metodo que se encarga de devolver si es Host
     */
    isHost(){
        return this.isHost;
    }

    /**
     * Metodo que se encarga de devolver el nombre de usuario
     */
    getUsername(){
        return this.username;
    }

    /**
     * Metodo que se encarga de actualizar las coordenadas del jugador 
     * @param {JSON} data Coordenadas nuevas del jugador
     */
    updateCoords(data){
        this.x = data.x;
        this.y = data.y;
    }

}

module.exports = Player;