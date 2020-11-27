/**
  * Coordenadas de la entidad
  * @typedef {Object} JSON
  * @property {number} x - Posicion X
  * @property {number} y - Posicion Y
  */

const BaseModel = require("../util/base-model");

/**
 * Representacion de la Spike para el servidor
 */
class Spike extends BaseModel{
    /**
     * Constructor
     * @param {string} id 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(id,x,y){
        super(id,x,y);
    }

    /**
     * Metodo que se encarga de actualizar las coordenadas de la Spike
     * @param {JSON} data 
     */
    updateCoords(data){
        this.x = data.x;
        this.y = data.y;
    }

}

module.exports = Spike;