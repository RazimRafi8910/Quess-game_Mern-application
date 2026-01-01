import { ServerSocketEvents, SocketEvents, GameState } from "../utils/constants.js";
import { sendSocketError, validateSocketRoom } from './socketHelper.js';

function handleSocketError(error) {
    return
}

export function handleSocketGameEvent(io, socket, gameLobby) {

    // room join
    socket.on(SocketEvents.JOIN_ROOM, (data,callback) => {
        const { gameId, playerId, username } = data;

        const game = gameLobby.getGameState(gameId);
        if (!game) {
            console.warn(`[JOIN_ROOM] Invalid room ID: ${gameId}, socket: ${socket.id}`);
            sendSocketError(io, gameId, "Game not found", false);
            //socket.emit(ServerSocketEvents.GAME_ROOM_ERROR, "Game not found");
            socket.leave(gameId);
            //callback({ status: false });
            return;
        }

        if (socket.rooms.has(gameId)) {
            if (game.state == GameState.STARTED) {
                io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_STARTED, { status: true, gameId,gameStarted:true });
            }
            //callback({ status: true });
            io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() });
            return;
        }
        
        //join room
        socket.join(gameId)
        const joined = game.addPlayer(playerId, username, socket.id);
        if (!joined) {
            socket.leave(gameId);
            //callback({ status: false });
            socket.emit(ServerSocketEvents.SOCKET_ERROR, "Room is Full")
            return
        }
        //callback({ status: true });
        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() }); //to json convert data to json format
    });

    // get game state
    socket.on(SocketEvents.GAME_STATE, ({ gameId }, callback) => {
        if (!gameId) return callback({ state: false, message: "no game Id" });

        const game = gameLobby.getGameState(gameId);

        if (!game) return callback({ state: false, message: "game not found" });

        callback({ status: true, message: "game found", gameState: game.toJson() });
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
            io.to(data.gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() })
        }
    });

    //player start status update
    socket.on(SocketEvents.PLAYER_UPDATE, (data) => {
        const game = gameLobby.getGameState(data.gameId)
        if (!game) {
            sendSocketError(io,gameId,"Game not found",false)
            //socket.emit(ServerSocketEvents.SOCKET_ERROR, "Game not found")
            return
        }

        const result = game.updatePlayerIsready(data.playerId, data.playerStatus)
        
        if (!result) {
            socket.emit(ServerSocketEvents.SOCKET_ERROR, "Player not updated")
            return
        }

        io.to(data.gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() });
    });

    //start game (host)
    socket.on(SocketEvents.START_GAME, (data) => {
        const { gameId,hostId } = data;

        const game = gameLobby.getGameState(gameId);
        if (!game) {
            console.log(`[game not found] gameId:${gameId} not found`);
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
                const isInTeam1 = gameState.game.teamOne.teamPlayers.some((_, playerData) => playerData.socketId == socket.id)
                if (isInTeam1) {
                    socket.join(gameState.game.teamOne.teamId);
                } else {
                    socket.join(gameState.game.teamTwo.teamId);
                }
            });
        })
        
        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_STARTING, gameState);
        return
    })
    
    //send generated questions
    socket.on(SocketEvents.GAME_QUESTION, async ({ gameId }, callback) => {
        if (!validateSocketRoom(socket, gameId)) {
            callback({ status: false, error: true, message: "Not belong to this room" });
            //return io.to(gameId).emit(ServerSocketEvents.SOCKET_ERROR, { message: "Not belong to this room", redirect: true });
        }
        const game = gameLobby.getGameState(gameId);
        if (!game) {
            callback({ status: false, error: true, message: "Invalid game id or missing game, please leave the game" });
            sendSocketError(io, gameId, "Game not found", true);
            return;
            //return io.to(gameId).emit(ServerSocketEvents.SOCKET_ERROR, { message: "invalid game Id", redirect: true });
        }

        try {
            const questionStatus = await game.getQuestion();
            //acknowledgment cb for frontend state update
            const response = {
                ...questionStatus,
                game: game.toJson({ questions: true }),
            }
            callback(response);
            //game Timer starts
            const result = game.startGameTimer();
            if (result) {
                io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_TIME_UPDATE, result);
            }
        } catch (error) {
            callback({ status: false, error: true, message: error.message });
        }
    });

    // intivitual player submit
    socket.on(SocketEvents.GAME_PLAYER_SUBMIT, ({gameId,submitData},callback) => {
        if (!validateSocketRoom(socket, gameId)) {
            callback({ status: false, message: "you are not belong to this game" });
            return
        }
        const game = gameLobby.getGameState(gameId);
        console.log(game)
        if (!game) {
            callback({ status: false, message: "invalid or missing game Id" });
        }

        const result = game.playerGameFinish(submitData);
        
        if (result.status) {
            callback(result);
        }
        io.to(gameId).emit()
    })

    // unused code (maybe,testing)
    // -----dummy-----
    // socket.on(SocketEvents.GAME_RUN, (data) => {
    //     const { gameId } = data;
    //     const game = gameLobby.getGameState(gameId);
    //     if (!game) {
    //         console.log(`[game not found] gameId:${gameId} not found`);
    //         return
    //     }

    //     io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_RUNNING, { gameState: game.toJson({ teams: true }) });

    // })

    //quit game (host&player)
    socket.on(SocketEvents.QUIT_GAME, ({ gameId, playerId }, callback) => {
        const game = gameLobby.getGameState(gameId);
        console.log("quit evetnt from ", socket.id, "playerId", playerId);
        if (!socket.rooms.has(gameId)) {
            console.log("gameid")
            socket.emit(ServerSocketEvents.GAME_ROOM_ERROR, { message: "You are not belong to this room or closed", redirect: true });
            return
        }
        
        if (!game) {
            socket.emit(ServerSocketEvents.GAME_ROOM_ERROR, { message: "invalid or missing game Id", redirect: false });
            socket.leave(gameId);
            return
        }

        const result = game.removePlayer(playerId);
        if (!result.status) return socket.emit(ServerSocketEvents.GAME_ROOM_ERROR, { message: "player not removed from game", redirect: false });
        socket.leave(gameId);
        console.log(result.newGameState);

        callback({ status: result.status });
        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState:result.newGameState });

    });

    //close room (host)
    socket.on(SocketEvents.CLOSE_ROOM,async ({gameId,playerId}) => {
        const game = gameLobby.getGameState(gameId);
        if (!game) {
            return
        }
        
        if (game.host.user_id !== playerId) {
            console.error("[game close error] player is not host");
            socket.emit(ServerSocketEvents.GAME_ROOM_ERROR,"Player is not host")
            return;
        }
        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_CLOSED, "Game is closed by the Host");        
        const socketsInRoom = await io.in(gameId).fetchSockets();
        socketsInRoom.forEach((socketInstance) => {
            socketInstance.leave(gameId);
        });
        const status = gameLobby.removeGameState(gameId);
        if (status) io.emit(ServerSocketEvents.LOBBY_ROOM_UPDATE, { data: gameLobby.getAllGameRooms() });
    })

    //player disconnect
    socket.on('disconnecting', () => {
        const [id, gameId] = [...socket.rooms]
        if (!gameId) {
            return
        }
        console.log("player disconneded");
        
        const game = gameLobby.getGameState(gameId)

        if (!game) {
            return
        }
        console.log('id:'+socket.player.user_id);
        const result = game.removePlayer(socket.player.user_id)
        if (result.host) {
            gameLobby.removeGameState(gameId);
            io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_CLOSED, {message:"Host disconnected from the game"});
            io.emit(ServerSocketEvents.LOBBY_ROOM_UPDATE, { data: gameLobby.getAllGameRooms() });
            socket.leave(gameId)
            return
        }
        
        socket.leave(gameId)
        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() });
    })
    
}

export function handleSocketRoomEvent(socket,lobby) {
    
}