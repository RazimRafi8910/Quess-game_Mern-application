import { saveGameResultDB } from "../services/gameResult.service.js";
import { ServerSocketEvents, SocketEvents, GameState, QuestionState } from "../utils/constants.js";
import { asyncWithGameMiddleware, sendSocketError, validateSocketRoom } from './socketHelper.js';

export function handleSocketGameEvent(io, socket, gameLobby) {

    // room join
    socket.on(SocketEvents.JOIN_ROOM, async (data) => {
        const { gameId, playerId, username } = data;

        const game = await gameLobby.getGameState(gameId);
        if (!game) {
            console.warn(`[JOIN_ROOM] Invalid room ID: ${gameId}, socket: ${socket.id}`);
            sendSocketError(io, socket.id, "Game not found", false);
            //socket.emit(ServerSocketEvents.GAME_ROOM_ERROR, "Game not found");
            socket.leave(gameId);
            //callback({ status: false });  
            return;
        }

        if (socket.rooms.has(gameId)) {
            if (game.state == GameState.STARTED) {
                io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_STARTED, { status: true, gameId, gameStarted: true });
            }
            //callback({ status: true });
            console.log("[game join] calld")
            io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() });
            return;
        }

        //join room
        socket.join(gameId)
        const joined = game.addPlayer(socket.player.user_id, username, socket.id);
        if (!joined) {
            socket.leave(gameId);
            //callback({ status: false });
            console.log("[game join] room is full")
            sendSocketError(io, socket.id, "room is full")
            return
        }
        //callback({ status: true });
        await gameLobby.saveGameState(gameId, game);
        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() }); //to json convert data to json format
    });


    //game state update
    socket.on(SocketEvents.GAME_STATE, asyncWithGameMiddleware(io, socket, gameLobby, (data, callback, game) => {
        callback({ status: true, message: "game found", gameState: game.toJson() });
    }));

    // room leaving
    socket.on(SocketEvents.LEAVE_ROOM, async (data) => {
        const game = await gameLobby.getGameState(data.gameId)
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
            await gameLobby.saveGameState(data.gameId, game);
            io.to(data.gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() })
        }
    });

    socket.on(SocketEvents.PLAYER_UPDATE, asyncWithGameMiddleware(io, socket, gameLobby, async (data, callback, game) => {
        if (!data.playerId || !data.playerStatus) {
            callback({ status: false, message: "Player not updated" })
            return
        }
        const result = game.updatePlayerIsready(data.playerId, data.playerStatus)

        if (!result) {
            socket.emit(ServerSocketEvents.SOCKET_ERROR, "Player not updated")
            return
        }

        await gameLobby.saveGameState(data.gameId, game);
        io.to(data.gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() });
    }))

    //start game (host)
    socket.on(SocketEvents.START_GAME, async (data) => {
        const { gameId, hostId } = data;

        const game = await gameLobby.getGameState(gameId);
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

        await gameLobby.saveGameState(gameId, game);
        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_STARTING, gameState);
        return
    })

    //send generated questions
    socket.on(SocketEvents.GAME_QUESTION, async ({ gameId }, callback) => {
        if (!validateSocketRoom(socket, gameId)) {
            callback({ status: false, error: true, message: "Not belong to this room" });
            return;
        }
        const game = await gameLobby.getGameState(gameId);
        if (!game) {
            callback({ status: false, error: true, message: "Invalid game id or missing game, please leave the game" });
            sendSocketError(io, gameId, "Game not found", true);
            return;
        }

        //TODO: needs rectoring
        try {
            const questionStatus = await game.getQuestion();
            console.log(`get question event called by ${socket.player.username} `, socket.id)

            if (!questionStatus.status) {
                if (questionStatus.error) {
                    callback({ status: false, error: true, message: questionStatus.message });
                    return;
                }
                if (questionStatus.questionState == QuestionState.PENDING) {
                    console.log("[GAME_QUESTION] pending cb send")
                    callback({ status: false, error: false, questionState: "Pending", message: "question is fetching" });
                    return;
                }
            }

            //acknowledgment cb for frontend state update
            const response = {
                ...questionStatus,
                questionState: "Ready",
                questionFallback: questionStatus.fallback,
                game: game.toJson({ questions: true }),
            }
            console.log(response)
            console.log("[GAME_QUESTION] question cb send");
            callback(response);

            //game Timer starts
            const result = game.startGameTimer();
            if (result.status && result.emit) {
                io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_TIME_UPDATE, result);
            }
        } catch (error) {
            console.log("[GAME_QUESTION] error", error)
            callback({ status: false, error: true, message: error.message });
        }
    });

    // intivitual player submit
    socket.on(SocketEvents.GAME_PLAYER_SUBMIT, async ({ gameId, submitData }, callback) => {
        if (!validateSocketRoom(socket, gameId)) {
            callback({ status: false, message: "you are not belong to this room" });
            return
        }
        const game = await gameLobby.getGameState(gameId);

        if (!game) {
            callback({ status: false, message: "invalid or missing game Id" });
        }

        const result = game.playerGameFinish(submitData);
        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() });
        if (result.status) {
            callback(result);
        }
    });


    // finsih game from client
    socket.on(SocketEvents.FINISH_GAME, async ({ gameId }, callback) => {
        if (!validateSocketRoom(socket, gameId)) {
            callback({ status: false, isFinished: false, message: "your are not belong this room" });
            return;
        }

        const game = await gameLobby.getGameState(gameId);

        if (!game) {
            callback({ status: false, isFinished: false, message: "game not found" });
            return;
        }

        const isFinished = game.isFinished();

        callback({ status: true, isFinished, gameState: game.toJson() });

        if (isFinished) {
            const result = gameLobby.finishGame(gameId);
            if (!result.status) {
                io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_ERROR, { message: result.message });
                return;
            }
            const saveResult = await saveGameResultDB(game.toJson());
            console.log("[finish game socket event] game finished and saved");
            if (saveResult.status) io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_CLOSED, { message: "Game Finished" });
            return;
        }
    });

    //quit game (host&player) - in Game
    socket.on(SocketEvents.QUIT_GAME, async ({ gameId, playerId }, callback) => {
        const game = await gameLobby.getGameState(gameId);
        console.log("quit evetnt from ", socket.id, "playerId", playerId);
        if (!socket.rooms.has(gameId)) {
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
        // TODO: create a player left event for making player left message to client
        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: result.newGameState });

    });

    //close room (host) - in lobby
    socket.on(SocketEvents.CLOSE_ROOM, async ({ gameId, playerId }) => {
        const game = await gameLobby.getGameState(gameId);
        if (!game) {
            return
        }

        if (game.host.user_id !== playerId) {
            console.error("[game close error] player is not host");
            socket.emit(ServerSocketEvents.GAME_ROOM_ERROR, "Player is not host")
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
    socket.on('disconnecting', async () => {
        const [id, gameId] = [...socket.rooms]
        if (!gameId) {
            return
        }
        console.log("player disconneded");

        const game = await gameLobby.getGameState(gameId)

        if (!game) {
            return
        }
        console.log('id:' + socket.player.user_id);
        const result = game.removePlayer(socket.player.user_id)
        if (result.host) {
            gameLobby.removeGameState(gameId);
            io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_CLOSED, { message: "Host disconnected from the game" });
            io.emit(ServerSocketEvents.LOBBY_ROOM_UPDATE, { data: gameLobby.getAllGameRooms() });
            socket.leave(gameId)
            return
        }

        socket.leave(gameId)
        io.to(gameId).emit(ServerSocketEvents.GAME_ROOM_UPDATE, { gameState: game.toJson() });
    })

}