class Room{
    constructor(id,host){
        this.id = id;
        this.host = host;
        this.sockets = {};
    }

    onConnect(socket,io){
        socket.on("updateGame", () => {
            
        })
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

    addPlayer(player){
        if(player != null){
            console.log(player);
            this.sockets[player.socket] = player;
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
        return players;
    }
}

module.exports = Room;
