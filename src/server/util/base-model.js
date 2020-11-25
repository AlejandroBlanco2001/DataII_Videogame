/**
 * Representacion de una entidad jugable
 */
class BaseModel{
    /**
     * Constructor
     * @param {string} id 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(id,x,y){
        this.id = id;
        this.x = x;
        this.y = y;
    }

    /**
     * Metodo que devuelve la ID de una entidad jugable
     */
    getID(){
        return this.id;
    }

    /**
     * Metodo que devuelve la posicion en X de la entidad jugable
     */
    getX(){
        return this.x;
    }

    /**
     * Metodo que se encarga de obtener la coordenada en Y de la entidad jugable
     */
    getY(){
        return this.y;
    }

    /**
     * Metood que se encarga de asignar una nueva coordenada en X
     * @param {number} value 
     */
    setX(value){
        this.x = value;
    }

    /**
     * Metodo que se encarga de asignar una nueva coordenada en Y
     * @param {number} value 
     */
    setY(value){
        this.y = value;
    }

    /**
     * Metodo que se encarga de obtener un JSON de las coordendas de la entidad jugable
     */
    getCoords(){
        let data = {
            x: this.x,
            y: this.y
        }
        return data;
    }
}

module.exports = BaseModel;