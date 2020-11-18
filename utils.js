var const_namespaces_rooms = [];
const MAX_ROOMS = 8;
var AVAILABLE_ROOM = 0;

/** 
  Inclusive random generate integers
*/
function randomInteger(min,max){
  return Math.floor(Math.random()*(max-min+1) +min);
}

/** 
    Generate the random identifier for a room 
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
function checkUserInRoom(rooms,idRoom, userID){
    let room = rooms[idRoom];
    let players = room.players;
    for(var key of Object.keys(players)){
        if(key == userID){
            return true;
        }
    }
    return false;
}

function isRoomFull(rooms,room){
    position = getRoom(room);
}

module.exports = {
    checkUserInRoom: checkUserInRoom,
    isAnyRoomAvailable: isAnyRoomAvailable,
    generateRandomID: generateRandomID,
}