const Room = require("../models/Room");
const Utilities = require("../utils");
const Player =  require("../models/Player");


class RoomManager{

    static rooms = {};
    static gameStarted = false;

    static joinRoom(room,socket,username,host){
        let pos = Utilities.getRandomRespawn();
        let p = new Player(socket.id,pos,host,username);
        room.addPlayer(p,socket.id);
        socket.join(room.getID(), () =>{
            socket.roomId = room.getID();
            console.log(socket.id, "Joined", room.getID());
        });
    }

    static onConnection(io,socket){
        let rooms = {}; 
        /**
         * Metodo que se encarga de manera asincronica mandar el listado de jugadores por sala
         * @param {String} roomId 
         */
        this.refreshLobby = (roomId) =>{
            return new Promise(() =>{
                setTimeout(() =>{
                    let room = this.rooms[roomId];
                    let names = room.namesPlayer();
                    io.to(room.getID()).emit("RefreshLobby",names);
                }, 200);
            });
        }
        
        this.update = (roomID,socket,update) =>{
            return new Promise(() => {
                setTimeout(() => {
                    if(update){
                        let players = this.rooms[roomID].getPlayers();
                        io.to(roomID).emit("UPDATE",players);
                    }
                },600);
            });
        }

        socket.on("createRoom", async (username) =>{
            let id = Utilities.generateRandomID();
            let r = new Room(id,socket.id,false);
            this.rooms[id] = r; 
            this.joinRoom(r,socket,username,true);
            socket.emit("createdRoom",id);
            await this.refreshLobby(id);
        });

        socket.on("joinRoom", async (roomID,username) => {
            if(!Utilities.checkUserInRoom(this.rooms,roomID)){
                const room = this.rooms[roomID];
                this.joinRoom(room,socket,username,false);
                socket.emit("createdRoom", roomID);
                await this.refreshLobby(roomID);
            }
        });
    
        socket.on("isLeader", (roomID) => {
            socket.emit("Leader",this.rooms[roomID].host == socket.id);
        });

        socket.on("StartGame", (roomID) => {
            io.to(roomID).emit("RoundStart");
        });

        socket.on("gameStart", (roomID) =>{
            let p = this.rooms[roomID].getPlayers();
            io.to(roomID).emit("PLAYERS",p);
        });

        socket.on("POSITION_CHANGE", async (data) => {
            let room = this.rooms[data.roomID];
            let player = room.getPlayer(socket.id);
            let shouldUpdate = player.checkIncrease(data);
            if(shouldUpdate){
                player.updateCoords(data);
            }
            await this.update(data.roomID,socket,shouldUpdate);
        });
    }

    getRooms(){
        return this.rooms;
    }

    getRoom(room){
        if(room != null){
            return this.rooms[room.getID()];
        }
    }
}

module.exports = RoomManager;
