const BaseModel = require("../util/base-model");

class Player extends BaseModel{
    constructor(id, position, host,username){
        super(id,position.x,position.y);
        this.host = host;
        this.username = username;
    }

    isHost(){
        return this.isHost;
    }

    getUsername(){
        return this.username;
    }

    updateCoords(data){
        this.x = data.x;
        this.y = data.y;
    }
}

module.exports = Player;