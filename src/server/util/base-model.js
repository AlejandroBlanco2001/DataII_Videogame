/**
 * Representacion de una entidad jugable
 */

 /**
  * Coordenadas de la entidad
  * @typedef {Object} JSON
  * @property {number} x - Posicion X
  * @property {number} y - Posicion Y
  */
class BaseModel{
    /**
     * Constructor
     * @param {string} id - ID del cliente
     * @param {number} x  - Posicion en x del cliente
     * @param {number} y - Posicion en y del cliente
     */
    constructor(id,x,y){
        this.id = id;
        this.x = x;
        this.y = y;
    }

    /**
     * Metodo que devuelve la ID de una entidad jugable
     * @returns {string} - ID de la sala
     */
    getID(){
        return this.id;
    }

    /**
     * Metodo que devuelve la posicion en X de la entidad jugable
     * @returns {number} - Posicion X de la entidad jugable
     */
    getX(){
        return this.x;
    }

    /**
     * Metodo que se encarga de obtener la coordenada en Y de la entidad jugable
     * @returns {number} - Posicion Y de la entidad jugable
     */
    getY(){
        return this.y;
    }

    /**
     * Metood que se encarga de asignar una nueva coordenada en X
     * @param {number} - Nueva coordenada en X
     */
    setX(value){
        this.x = value;
    }

    /**
     * Metodo que se encarga de asignar una nueva coordenada en Y
     * @param {number} - Nueva coordenada en Y
     */
    setY(value){
        this.y = value;
    }

    /**
     * Metodo que se encarga de obtener un JSON de las coordendas de la entidad jugable
     * @returns {JSON} - Coordenadas (x,y) de la entidad jugable
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