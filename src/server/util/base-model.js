class BaseModel{
    constructor(id,x,y){
        this.id = id;
        this.x = x;
        this.y = y;
    }

    getID(){
        return this.id;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    setX(value){
        this.x = value;
    }

    setY(value){
        this.y = value;
    }

    getCoords(){
        let data = {
            x: this.x,
            y: this.y
        }
        return data;
    }
}

module.exports = BaseModel;