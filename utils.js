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
    if(isAnyRoomAvailable()){
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
    }else{
        console.log("ROOMS NO AVAILABLES");
        return null;
    }
}

/**
 * Metodo que se encarga de devolver si hay salas disponibles
 */
function isAnyRoomAvailable(){
    return MAX_ROOMS != AVAILABLE_ROOM;
}

/**
 * Metodo que se encarga de verificar si el usuario se encuentra en alguna sala
 * @param {*} rooms - Salas a verificar
 * @param {String} idUser - Cadena que representa el ID del usuario
 */
function checkUserInRoom(rooms, idUser){

}

function isRoomFull(rooms,room){
    position = getRoom(room);
}

module.exports = {
    getRoomIdByName: getRoomIdByName,
    getRoom: getRoom,
    checkUserInRoom: checkUserInRoom,
    isAnyRoomAvailable: isAnyRoomAvailable,
    generateRandomID: generateRandomID,
    checkUniqueID: checkUniqueID
}