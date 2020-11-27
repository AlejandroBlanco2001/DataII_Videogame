/**
 * Representacion de una sala del Servidor
 */

/**
  * Coordenadas de la entidad
  * @typedef {Object} JSON
  * @property {number} x - Posicion X
  * @property {number} y - Posicion Y
*/

class Room{
    /**
     * Constructor
     * @param {string} id ID de la sala 
     * @param {string} host ID del socket que inicia la partida
     * @param {boolean} state Partida iniciada 
     */
    constructor(id,host,state){
        this.id = id;
        this.host = host;
        this.playing = state;
        this.spike;
        this.sockets = {};
    }

    /**
     * Metodo que se encarga de añadir una Spike a la partida
     * @param {Object} spike Spike de la partida 
     */
    addSpike(spike){
        this.spike = spike; 
    }

    /**
     * Metodo que se encarga de obtener la Spike de la partida
     * @returns - Spike de la room
     */
    getSpike(){
        return this.spike;
    }

    /**
     * Metodo que se encarga de actualizar un jugador
     * @param {Object} socket Socket del cliente 
     * @param {JSON} data Coordenadas del jugador
     */
    updatePlayers(socket,data){
        let p = this.sockets[socket.id];
        p.updateCoords(data);
    }

    /**
     * Metodo que se encarga de devolver la lista de jugadores
     */
    getPlayers(){
        return this.sockets;
    }

    /**
     * Metood que se encarga de obtener un jugador
     * @param {string} playerID ID del socket de un jugador
     */
    getPlayer(playerID){
        return this.sockets[playerID];
    }

    /**
     * Metodo que se encarga de devolver el ID del socket que es host
     * @returns {string} - ID del socket que es host 
     */
    getHost(){
        return this.host;
    }

    /**
     * Metodo que devuelve el ID de la sala
     * @returns {string} ID de la sala
     */
    getID(){
        return this.id;
    }

    /**
     * Metodo que es encarga de añadir jugadores a la sala
     * @param {Object} player - Jugador del cliente a agregar
     * @param {Object} socket - ID del socket del cliente a agregar
     */
    addPlayer(player,socket){
        if(player != null){
            this.sockets[socket] = player;
        }
    }

    /**
     * Metodo que se encarga de expulsar un jugador si se desconecta
     * @param {Object} socketID - ID del socket del cliente a expulsar
     */
    expulsePlayer(socketID){
        delete this.sockets[socketID];
    }

    /**
     * Metodo que se encarga de obtener la lista de los jugadores de la sala
     * @returns {string} Nombre de todos los jugadores
     */
    namesPlayer(){
        var players = "";  
        for(var id in this.sockets){
            players += "\n" + this.sockets[id].getUsername();
        }
        return players;
    }
}

module.exports = Room;
