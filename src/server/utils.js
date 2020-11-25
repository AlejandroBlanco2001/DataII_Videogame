var const_namespaces_rooms = [];
const MAX_ROOMS = 8;
var AVAILABLE_ROOM = 0;
/**
 * Posibles posiciones de Respawn
 */
const posibleRespawnPoints = [{x:256,y:627,respawn:false},
    {x:494,y:577,respawn:false},{x:640,y:577,respawn:false},
    {x:861,y:627,respawn:false},{x:868,y:341,respawn:false},
    {x:189,y:367,respawn:false},{x:391,y:214,respawn:false},
    {x:599,y:286,respawn:false}];


/** 
    Inclusive random generate integers
*/
function randomInteger(min,max){
    return Math.floor(Math.random()*(max-min+1) +min);
}

/** 
* Generate the random identifier for a room 
*/
function generateRandomID(){
    let letters = "abcdefghijklmnopqrstuvwxyz";
    let ID = "";
    for(let i = 0; i < 6; i++){
        let random = randomInteger(0,26);
        ID += letters.charAt(random);
    }
    while(!checkUniqueID(ID)){
        generateRandomID();
    }
    const_namespaces_rooms[AVAILABLE_ROOM] = ID;
    AVAILABLE_ROOM += 1;
    return ID;
}

/**
 * Metodo que se encarga de devolver si hay salas disponibles
 */
function isAnyRoomAvailable(){
    return MAX_ROOMS != AVAILABLE_ROOM;
}

function checkUniqueID(ID){
    for(let i = 0; i < const_namespaces_rooms.length; i++){
        if(ID == const_namespaces_rooms[i]){
            return false;
        }
    }
    return true;
}

/**
 * Metodo que se encarga de verificar si el usuario se encuentra en alguna sala
 * @param {*} rooms - Salas a verificar
 * @param {String} idUser - Cadena que representa el ID del usuario
 */
function checkUserInRoom(rooms,idRoom){
    let room = rooms[idRoom];
    let players = room.sockets;
    var i;
    for(var key of Object.keys(players)){
        i += 1;    
    }
    return i == 8;
}

/**
 * Metodo que se encarga de recibir una coordenada aleatoria donde reaparecer
 */
function getRandomRespawn(){
    let index = randomInteger(0,posibleRespawnPoints.length-1);
    let posRespawn = posibleRespawnPoints[index];
    while(posRespawn.respawn){
        index = randomInteger(0,posibleRespawnPoints.length-1);
        posRespawn = posibleRespawnPoints[index];
    }
    index.respawn = true;
    return posRespawn;
}

module.exports = {
    checkUserInRoom: checkUserInRoom,
    isAnyRoomAvailable: isAnyRoomAvailable,
    generateRandomID: generateRandomID,
    getRandomRespawn: getRandomRespawn,
}