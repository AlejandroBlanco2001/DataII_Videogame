const Room = require("../models/Room");
const Utilities = require("../utils");
const Player =  require("../models/Player");
const Spike = require("../models/Spike");

/**
 * Representacion de un manejador de Salas
 */
class RoomManager{
    
    // Salas del servidor
    static rooms = {};

    /**
     * Metodo que se encarga de añadir sockets a la sala de juego
     * @param {string} room ID de la sala 
     * @param {Socket} socket Socket del cliente 
     * @param {string} username Nombre del usuario 
     * @param {boolean} host Representacion de si el jugador es host de su sala 
     */
    static joinRoom(room,socket,username,host){
        let pos = Utilities.getRandomRespawn();
        let p = new Player(socket.id,pos,host,username);
        room.addPlayer(p,socket.id);
        socket.join(room.getID(), () =>{
            socket.roomId = room.getID();
            console.log(socket.id, "Joined", room.getID());
        });
    }

    /**
     * Metodo estatico que representa el manejo de las salas 
     * @param {IO} io Representa el servidor
     * @param {Socket} socket Representa el socket de cada cliente 
     */
    static onConnection(io,socket){

        /**
         * Metodo que se encarga de manera asincronica mandar el listado de jugadores por sala
         * @param {string} roomId 
         */
        this.refreshLobby = (roomId) =>{
            return new Promise(() =>{
                setTimeout(() =>{
                    let room = this.rooms[roomId];
                    let names = room.namesPlayer();
                    io.to(roomId).emit("RefreshLobby",names);
                }, 1000);
            });
        }

        /**
         * Metodo asincronico que se encarga de actualizar la posicion de los jugadores
         * @param {string} roomID ID del servidor 
         */
        this.update = (roomID) =>{
            return new Promise(() => {
                setTimeout(() => {
                    let players = this.rooms[roomID].getPlayers();
                    io.to(roomID).emit("UPDATE",players);
                },600);
            });
        }

        /**
         * Metodo que se encarga de actualizara la Spike
         * @param {string} roomID  ID del servidor
         */
        this.updateSpike = (roomID) =>{
            let spike = this.rooms[roomID].getSpike();
            io.to(roomID).emit("SPIKE_UPDATE",spike);
        }
        
        // Metodo que se encarga de crear una sala de manera asincronica
        socket.on("createRoom", async (username) =>{
            let id = Utilities.generateRandomID();
            let r = new Room(id,socket.id,false);
            this.rooms[id] = r; 
            this.joinRoom(r,socket,username,true);
            socket.emit("createdRoom",id);
            await this.refreshLobby(id);
        });

        // Metodo que se encarga de unir a los clientes a una sala
        socket.on("joinRoom", async (roomID,username) => {
            if(!Utilities.checkUserInRoom(this.rooms,roomID)){
                const room = this.rooms[roomID];
                this.joinRoom(room,socket,username,false);
                socket.emit("createdRoom", roomID);
                await this.refreshLobby(roomID);
            }
        });
    
        // Metodo que se encarga de verificar si la persona es el host de su sala
        socket.on("isLeader", (roomID) => {
            socket.emit("Leader",this.rooms[roomID].host == socket.id);
        });

        // Metodo que se encarga de iniciar una partida de una sala en especifica
        socket.on("StartGame", (roomID) => {
            this.rooms[roomID].addSpike(new Spike("Spike",600,400));
            this.rooms[roomID].playing = true;
            io.to(roomID).emit("RoundStart");
        });

        // Metodo que se encarga de devolver todos los jugadores a cada cliente
        socket.on("gameStart", (roomID) =>{
            let p = this.rooms[roomID].getPlayers();
            let s = this.rooms[roomID].getSpike();
            let data = {
                x: s.getX(),
                y: s.getY()
            }
            io.to(roomID).emit("PLAYERS",p,data);
        });

        // Metodo asincronico que se encarga de notificar la actualizacion de las posiciones de los jugadores 
        socket.on("POSITION_CHANGE", async (data) => {
            let room = this.rooms[data.room];
            let player = room.getPlayer(socket.id);
            player.updateCoords(data);
            await this.update(data.room);
        });

        // Metodo asincronico que se encarga de notificar la actualizacion de la posicion de la Spike 
        socket.on("UPDATE_SPIKE", (data) => {
            let room = this.rooms[data.roomID];
            room.getSpike().updateCoords(data);
            this.updateSpike(data.roomID);
        });

        // Metodo que se encarga de notificar la finalizacion de la partida
        socket.on("GAME_OVER", (roomID) => {
            this.rooms[roomID].playing = false;
            io.to(roomID).emit("LOBBY");
        });

    }

    /**
     * Metodo que se encarga de obtener las salas del Servidro
     */
    getRooms(){
        return this.rooms;
    }

    /**
     * Metodo que se encarga de obtener una sala en particular
     * @param {string} room ID de la sala
     */
    getRoom(room){
        if(room != null){
            return this.rooms[room.getID()];
        }
    }
}

module.exports = RoomManager;
