import { ServerSocketEvents, SocketEvents } from "../utils/constants.js";

function handleSocketError(error) {
    return
}

export function handleSocketGameEvent(io, socket, gameLobby) {

    socket.on(SocketEvents.JOIN_ROOM, (data) => {
        if (!socket.rooms.has(data.gameId)) {
            socket.join(data.gameId)
        }
        console.log(socket.rooms)
        const game = gameLobby.getGameState(data.gameId);
        game.addPlayer(data.playerId, data.username)
        io.to(data.gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() }); //to json convert data to json format
        //console.log(gameLobby.getAllGameRooms());
        //callback({gameState:game})
    });

    socket.on(SocketEvents.LEAVE_ROOM, (data) => {
        const game = gameLobby.getGameState(data.gameId)
        if (!game) {
            return
        }

        if (data.playerId == game.host.user_id) {
            gameLobby.removeGameState(data.gameId);
            return
        }

        const result = game.removePlayer(data.playerId)
        if (result) {
            socket.leave(data.gameId)
            io.to(data.gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE,{gameState:game.toJson()})
        }
    })
    
}

export function handleSocketRoomEvent(socket,lobby) {
    
}