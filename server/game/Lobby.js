import { Game } from "./Game.js";
import { GameState, ServerSocketEvents } from '../utils/constants.js'
import redisClient from "../services/redisClient.js";
import { QuestionType } from "../utils/constants.js";

export class Lobby {
    static lobbyInstance;

    constructor(io) {
        Lobby.lobbyInstance = this;
        this.io = io;
        this.rooms = new Set();
        this.activeGames = new Map();
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

    async createGame(gameHost, category, gameName, password, noPlayers, userId, hostSocketId, aiQuestion) {
        // question type of the game
        const questionType = aiQuestion ? QuestionType.AI : QuestionType.NORMAL;
        //create a new game
        const newGame = new Game(gameHost, category, gameName, password, noPlayers, hostSocketId, questionType);
        const player = this.players.get(userId); // add host player to the lobby state
        if (!player) {
            return new Error(`[game create, lobby] Player not found ${userId}`);
        }
        this.rooms.add(newGame.gameId);
        await redisClient.set(`game:${newGame.gameId}`, JSON.stringify(newGame.toJson({ password: true, teams: true, questions: true })));

        this.io.emit(ServerSocketEvents.LOBBY_ROOM_UPDATE, { data: await this.getAllGameRooms({ localGameOnly: false }) });
        //player joins the new socket room
        this.io.sockets.sockets.get(player.socketId).join(newGame.gameId);

        // subscribe to game events
        newGame.on(`game:${newGame.gameId}:question`, ({ gameId, questions }) => {
            console.log("[lobby] game question generated : ");
            redisClient.set(newGame.gameId, JSON.stringify(newGame.toJson({ password: true, teams: true, questions: true })));
            this.io.to(gameId).emit(ServerSocketEvents.GAME_QUESTIONS, { gameId, questions });
        });
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

        const currentRooms = await redisClient.keys("game:*");

        const filterdKeys = localGameOnly ? currentRooms.filter((key) => this.rooms.has(key.split(":")[1])) : currentRooms;

        const result = await Promise.all(filterdKeys.map(async (gameKey) => {
            const game = await redisClient.get(`${gameKey}`);
            return Game.fromJson(JSON.parse(game)).toJson({ password: true, teams: true, questions: true });
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

    async saveGameState(gameId, gameInstance) {
        const game = this.rooms.has(gameId);
        if (!game) {
            return {
                status: false,
                message: "game not found"
            }
        }
        // update the game in the redis
        await redisClient.set(`game:${gameId}`, JSON.stringify(gameInstance.toJson({ password: true, teams: true, questions: true })));
        return true;
    }

    async removeGameState(gameId) {
        if (this.rooms.has(gameId)) {
            await redisClient.del(`game:${gameId}`);
            this.rooms.delete(gameId)
            return true;
        }
        // if (this.rooms.has(gameId)) {
        //     this.rooms.delete(gameId)
        //     return true
        // }
        // return false
    }

    async updateGameQuestions(gameId, questions) {
        const game = this.rooms.get(gameId);
        if (!game) {
            return {
                status: false,
                message: "game not found"
            }
        }
        game.questions = questions;
        await this.saveGameState(gameId, game);
        return true;
    }

}