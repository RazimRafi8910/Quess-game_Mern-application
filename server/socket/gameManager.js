import { ServerSocketEvents, SocketEvents } from "../utils/constants.js";

function handleSocketError(error) {
    return
}

export function handleSocketGameEvent(io, socket, gameLobby) {

    // room join
    socket.on(SocketEvents.JOIN_ROOM, (data) => {
        const { gameId, playerId, username } = data;

        const game = gameLobby.getGameState(gameId);
        if (!game) {
            console.warn(`[JOIN_ROOM] Invalid room ID: ${gameId}, socket: ${socket.id}`);
            socket.emit(ServerSocketEvents.GAME_ROOM_ERROR, "Game not found", true, true);
            socket.leave(gameId);
            return;
        }

        if (socket.rooms.has(gameId)) {
            io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() });
            return;
        }
        
        //join room
        socket.join(gameId)

        const joined = game.addPlayer(playerId, username)
        if (!joined) {
            socket.leave(gameId);
            socket.emit(ServerSocketEvents.SOCKET_ERROR, "Room is Full")
            return
        }
        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() }); //to json convert data to json format
    });

    // room leaving
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

    //player start status update
    socket.on(SocketEvents.PLAYER_UPDATE, (data) => {
        console.log(socket.rooms)
        const game = gameLobby.getGameState(data.gameId)
        if (!game) {
            socket.emit(ServerSocketEvents.SOCKET_ERROR, "Game not found")
            return
        }

        const result = game.updatePlayerIsready(data.playerId, data.playerStatus)
        
        if (!result) {
            socket.emit(ServerSocketEvents.SOCKET_ERROR, "Player not updated")
            return 
        }

        io.to(data.gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() });
    })

    //start game (host)
    socket.on(SocketEvents.START_GAME, (data) => {
        const { gameId,hostId } = data;

        const game = gameLobby.getGameState(gameId);
        if (!game) {
            return
        }
        const started = game.startGame(hostId);
        console.warn(started)
        if (!started) {
            io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_ERROR, "Player are not ready",false);
        }

    })

    //close room (host)
    socket.on(SocketEvents.CLOSE_ROOM, (data) => {
        const game = gameLobby.getGameState(data.gameId);
        if (!game) {
            return
        }
        if (game.host.user_id !== data.playerId) {
            console.error("[game close error] player is not host");
            socket.emit(ServerSocketEvents.GAME_ROOM_ERROR,"Player is not host")
            return;
        }

        io.to(data.gameId).emit(ServerSocketEvents.Game_ROOM_CLOSED,"Game is closed by the Host")
    })

    socket.on('disconnecting', () => {
        const [id, gameId] = [...socket.rooms]
        if (!gameId) {
            return
        }

        const game = gameLobby.getGameState(gameId)
        console.log('id:'+socket.player.user_id);
        const result = game.removePlayer(socket.player.user_id)
        if (!result) {
            return
        }
        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() });

    })
    
}

export function handleSocketRoomEvent(socket,lobby) {
    
}