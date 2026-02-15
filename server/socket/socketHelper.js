import { ServerSocketEvents } from "../utils/constants.js";

export const validateSocketRoom = (socket, gameId) => {
    return socket.rooms.has(gameId);
}

// remove this function if not used
export const startGameTimer = (game, io) => {
    if (!game) return false;

    const currentTime = Date.now()
    game.gameStartedTime = currentTime;
    game.gameEndAt = currentTime + game.gameTime * 1000

    io.to(game.gameId).emit(ServerSocketEvents.GAME_ROOM_TIME_UPDATE, { starting: currentTime, endTime: game.gameEndAt });
    return
}


export const sendSocketError = (io, gameId, message, redirect = false) => {
    io.to(gameId).emit(ServerSocketEvents.SOCKET_ERROR, { message, redirect });
}


export const asyncWithGameMiddleware = (io, socket, gameLobby, handler) => {
    return async (data, callback) => {
        const gameId = data?.gameId;

        if (!gameId) {
            const message = "Missing gameId";
            if (typeof callback === 'function') return callback({ status: false, message });
            return socket.emit(ServerSocketEvents.SOCKET_ERROR, { message });
        }

        const game = gameLobby.getGameState(gameId);

        if (!game) {
            const message = "Game not found";
            if (typeof callback === 'function') return callback({ status: false, message });
            return sendSocketError(io, gameId, message);
        }

        try {
            await handler(data, callback, game);
        } catch (error) {
            console.error(`[Socket Middleware Error] ${error.message}`);
            if (typeof callback === 'function') return callback({ status: false, message: "Internal server error" });
        }
    };
}


export const withGameMiddleware = (io, socket, gameLobby, handler) => {
    return (data, callback) => {
        const gameId = data?.gameId;
        if (!gameId) {
            const message = "Missing gameId";
            if (typeof callback === 'function') return callback({ status: false, message });
            return socket.emit(ServerSocketEvents.SOCKET_ERROR, { message });
        }
        const game = gameLobby.getGameState(gameId);
        if (!game) {
            const message = "Game not found";
            if (typeof callback === 'function') return callback({ status: false, message });
            return sendSocketError(io, gameId, message);
        }
        console.log("working")
        try {
            handler(data, callback, game);
        } catch (error) {
            console.error(`[Socket Middleware Error] ${error.message}`);
            if (typeof callback === 'function') return callback({ status: false, message: "Internal server error" });
        }
    }
}