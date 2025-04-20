import { SocketEvents } from "../utils/constants.js";


export function handleSocketGameEvent(io, socket, gameLobby) {

    socket.on(SocketEvents.JOIN_ROOM, (data, callback) => {
        console.log(data.playerId)
        const game = gameLobby.getGameState(data.gameId);
        callback({gameState:game})
    })
    
}

export function handleSocketRoomEvent(socket,lobby) {
    
}