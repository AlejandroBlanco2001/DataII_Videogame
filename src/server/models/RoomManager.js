const Room = require("../models/Room");
const Utilities = require("../utils");
const Player =  require("../models/Player");
const Spike = require("../models/Spike");

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
                }, 100);
            });
        }

        this.update = (roomID) =>{
            return new Promise(() => {
                setTimeout(() => {
                    let players = this.rooms[roomID].getPlayers();
                    io.to(roomID).emit("UPDATE",players);
                },1000);
            });
        }

        this.updateSpike = (roomID) =>{
            let spike = this.rooms[roomID].getSpike();
            io.to(roomID).emit("SPIKE_UPDATE",spike);
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
            this.rooms[roomID].addSpike(new Spike("Spike",600,400));
            this.rooms[roomID].playing = true;
            io.to(roomID).emit("RoundStart");
        });

        socket.on("gameStart", (roomID) =>{
            let p = this.rooms[roomID].getPlayers();
            let s = this.rooms[roomID].getSpike();
            let data = {
                x: s.getX(),
                y: s.getY()
            }
            io.to(roomID).emit("PLAYERS",p,data);
        });

        socket.on("POSITION_CHANGE", async (data) => {
            let room = this.rooms[data.room];
            let player = room.getPlayer(socket.id);
            player.updateCoords(data);
            await this.update(data.room);
        });

        socket.on("UPDATE_SPIKE", (data) => {
            let room = this.rooms[data.roomID];
            room.getSpike().updateCoords(data);
            this.updateSpike(data.roomID);
        });

        socket.on("GAME_OVER", (roomID) => {
            this.rooms[roomID].playing = false;
            io.to(roomID).emit("LOBBY");
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
