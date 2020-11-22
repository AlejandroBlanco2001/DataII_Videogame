class Room{
    constructor(id,host,state){
        this.id = id;
        this.host = host;
        this.playing = state;
        this.sockets = {};
    }

    updatePlayers(socket,data){
        let p = this.sockets[socket.id];
        p.updateCoords(data);
    }

    getPlayers(){
        return this.sockets;
    }

    getPlayer(playerID){
        return this.sockets[playerID];
    }

    getHost(){
        return this.host;
    }

    getID(){
        return this.id;
    }

    addPlayer(player,socket){
        if(player != null){
            this.sockets[socket] = player;
        }
    }

    expulsePlayer(socketID){
        delete this.sockets[socketID];
    }

    namesPlayer(){
        var players = "";  
        for(var id in this.sockets){
            players += "\n" + this.sockets[id].getUsername();
        }
        console.log(players);
        return players;
    }
}

module.exports = Room;
