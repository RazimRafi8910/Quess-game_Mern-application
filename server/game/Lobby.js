import { Game } from "./Game.js";
import { GameState, ServerSocketEvents } from '../utils/constants.js'
import redisClient from "../services/redisClient.js";

export class Lobby {
    static lobbyInstance;

    constructor(io) {
        Lobby.lobbyInstance = this;
        this.io = io;
        this.rooms = new Set();
        this.roomsCount = 0;
        this.players = new Map();
    }

    static getLobbyInstance() {
        if (!Lobby.lobbyInstance) {
            throw new Error("[Lobby] Lobby not initialized");
        }
        return Lobby.lobbyInstance;
    }

    addPlayer(player, socketId) {
        this.players.set(player.user_id, { socketId, ...player });
    }

    removePlayer(playerId) {
        this.players.delete(playerId);
    }

    getAllPlayers() {
        console.log(this.players)
        return this.players;
    }

    createGame(gameHost, category, gameName, password, noPlayers, userId, hostSocketId, aiQuestion) {
        //create a new game
        const newGame = new Game(gameHost, category, gameName, password, noPlayers, hostSocketId, aiQuestion);
        const player = this.players.get(userId); // add host player to the lobby state
        if (!player) {
            return new Error(`[game create, lobby] Player not found ${userId}`);
        }
        this.rooms.add(newGame.gameId);
        redisClient.set(`game:${newGame.gameId}`, JSON.stringify(newGame.toJson({ password: true, teams: true, questions: true })));
        this.io.emit(ServerSocketEvents.LOBBY_ROOM_UPDATE, { data: this.getAllGameRooms() });
        //player joins the new socket room
        this.io.sockets.sockets.get(player.socketId).join(newGame.gameId);
        return newGame;
    }

    finishGame(gameId) {
        const game = this.rooms.get(gameId);
        if (!game) {
            return {
                status: false,
                message: "game not found"
            }
        }

        const status = this.rooms.delete(gameId)
        return {
            status,
            message: "game removed"
        }
    }

    async getAllGameRooms({ localGameOnly = true } = {}) {
        // localGameOnly used for get only games in the server room not in redis 
        // const currentRooms = [...this.rooms.values()]
        // const result = currentRooms.filter((game) => (game.state == GameState.LOBBY));
        // return result;

        const currentRooms = await redisClient.keys("game:*");

        const filterdKeys = localGameOnly ? currentRooms.filter((key) => this.rooms.has(key.split(":")[1])) : currentRooms;

        const result = await Promise.all(filterdKeys.map(async (gameKey) => {
            const game = await redisClient.get(`${gameKey}`);
            return Game.fromJson(JSON.parse(game));
        }));

        return result;
    }

    async getGameState(gameId) {
        // if (this.rooms.has(gameId)) {
        //     return this.rooms.get(gameId)
        // }
        // return null;
        if (this.rooms.has(gameId)) {
            const game = await redisClient.get(`game:${gameId}`);
            const gameInstance = Game.fromJson(JSON.parse(game));
            return gameInstance;
        }
        return null;
    }

    saveGameState(gameId, gameInstance) {
        const game = this.rooms.has(gameId);
        if (!game) {
            return {
                status: false,
                message: "game not found"
            }
        }
        // update the game in the redis
        redisClient.set(`game:${gameId}`, JSON.stringify(gameInstance.toJson({ password: true, teams: true, questions: true })));
        return true;
    }

    removeGameState(gameId) {
        if (this.rooms.has(gameId)) {

        }
        if (this.rooms.has(gameId)) {
            this.rooms.delete(gameId)
            return true
        }
        return false
    }

}