import { ServerSocketEvents } from "../utils/constants.js";

export const validateSocketRoom = (socket, gameId) => {
    return socket.rooms.has(gameId);
}

export const startGameTimer = (game,io) => {
    if (!game) return false;

    const currentTime = Date.now()
    game.gameStartedTime = currentTime;
    game.gameEndAt = currentTime + game.gameTime * 1000

    io.to(game.gameId).emit(ServerSocketEvents.GAME_ROOM_TIME_UPDATE, { starting: currentTime, endTime: game.gameEndAt });
    return
}