import { ServerSocketEvents } from "../utils/constants.js";

export const validateSocketRoom = (socket, gameId) => {
    return socket.rooms.has(gameId);
}

// remove this function if not used
export const startGameTimer = (game,io) => {
    if (!game) return false;

    const currentTime = Date.now()
    game.gameStartedTime = currentTime;
    game.gameEndAt = currentTime + game.gameTime * 1000

    io.to(game.gameId).emit(ServerSocketEvents.GAME_ROOM_TIME_UPDATE, { starting: currentTime, endTime: game.gameEndAt });
    return
}


export const sendSocketError = (io, gameId, message, redirect=false) => {
    io.to(gameId).emit(ServerSocketEvents.SOCKET_ERROR, { message, redirect });
}