const Room = require("../models/Room");
const Utilities = require("../utils");
const Player =  require("../models/Player");


class RoomManager{

    static rooms = {};
     
    static joinRoom(room,socket,username,host){
        let pos = Utilities.getRandomRespawn();
        let p = new Player(socket.id,pos,host,username);
        room.addPlayer(p);
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
        };
        
        socket.on("createRoom", async (username) =>{
            let id = Utilities.generateRandomID();
            let r = new Room(id,socket.id);
            this.rooms[id] = r; 
            this.joinRoom(r,socket,username,true);
            socket.emit("createdRoom",id);
            await this.refreshLobby(id);
        });

        socket.on("joinRoom", async (username,roomID) => {
            if(!Utilities.checkUserInRoom(rooms,roomID)){
                const room = this.rooms[roomID];
                this.joinRoom(room,socket,username,false);
                socket.emit("createdRoom", roomID);
                await this.refreshLobby(roomID);
            }
        });
    
        socket.on("isLeader", (roomID) => {
            socket.emit("Leader",this.rooms[roomID].host == socket.id);
        })

        socket.on("StartGame", (roomID) =>{
            let room = rooms[roomID];
            let players = room.getPlayers();
            io.to(roomID).emit("RoundStart", players);
            room.onConnection(io,socket);
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
