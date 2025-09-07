import { ServerSocketEvents, SocketEvents, GameState } from "../utils/constants.js";

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
            if (game.state == GameState.STARTED) {
                io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_STARTED, { status: true, gameId,gameStarted:true });
            }
            io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() });
            return;
        }
        
        //join room
        socket.join(gameId)
        const joined = game.addPlayer(playerId, username, socket.id);
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
        if (result.status) {
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
            console.log(`game not found] gameId:${gameId} not found`);
            return
        }

        //game starts
        const gameState = game.startGame(hostId);
        
        if (!gameState.status) {
            io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_ERROR, gameState.message, false);
            return
        }
        io.in(data.gameId).fetchSockets().then((sockets) => {
            sockets.forEach(socket => {
                const isInTeam1 = gameState.team1.teamPlayers.some((_, playerData) => playerData.socketId == socket.id)
                if (isInTeam1) {
                    socket.join(gameState.team1.teamId);
                } else {
                    socket.join(gameState.team2.teamId);
                }
            });
        })
        
        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_STARTING, gameState);
    })
    
    //game running
    socket.on(SocketEvents.GAME_RUN, (data) => {
        const { gameId } = data;
        console.log(gameId)
        const game = gameLobby.getGameState(gameId);
        if (!game) {
            console.log(`[game not found] gameId:${gameId} not found`);
            return
        }

        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_RUNNING, { gameState: game.toJson({ teams: true }) });

    })

    //close room (host)
    socket.on(SocketEvents.CLOSE_ROOM, ({gameId,playerId}) => {
        const game = gameLobby.getGameState(gameId);
        if (!game) {
            return
        }
        if (game.host.user_id !== playerId) {
            console.error("[game close error] player is not host");
            socket.emit(ServerSocketEvents.GAME_ROOM_ERROR,"Player is not host")
            return;
        }
        const status = gameLobby.removeGameState(gameId);
        if (status) {
            io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_CLOSED, "Game is closed by the Host");
        }
        io.emit(ServerSocketEvents.LOBBY_ROOM_UPDATE, { data: gameLobby.getAllGameRooms() });
    })

    //player disconnect
    socket.on('disconnecting', () => {
        const [id, gameId] = [...socket.rooms]
        if (!gameId) {
            return
        }

        const game = gameLobby.getGameState(gameId)

        if (!game) {
            return
        }
        console.log('id:'+socket.player.user_id);
        const result = game.removePlayer(socket.player.user_id)
        if (result.host) {
            gameLobby.removeGameState(gameId);
            io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_CLOSED, "Host disconnected from the game");
            io.emit(ServerSocketEvents.LOBBY_ROOM_UPDATE, { data: gameLobby.getAllGameRooms() });
            return
        }
        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() });

    })
    
}

export function handleSocketRoomEvent(socket,lobby) {
    
}