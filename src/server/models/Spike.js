const BaseModel = require("../util/base-model");

class Spike extends BaseModel{
    constructor(id,x,y){
        super(id,x,y);
    }

    updateCoords(data){
        this.x = data.x;
        this.y = data.y;
    }

}

module.exports = Spike;