import { Game } from "./Game.js";
import { GameState, ServerSocketEvents } from '../utils/constants.js'

export class Lobby {
    constructor(io) {
        this.io = io;
        this.rooms = new Map();
        this.roomsCount = 0;
        this.players = new Map();
    }

    addPlayer(player,socketId) {
        this.players.set(player.user_id, { socketId,...player });
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
        const player = this.players.get(userId); // add player to the lobby state
        if (!player) {
            return new Error(`[game create, lobby] Player not found ${userId}`);
        }
        this.rooms.set(newGame.gameId, newGame);
        this.io.emit(ServerSocketEvents.LOBBY_ROOM_UPDATE, {data: this.getAllGameRooms()});
        //player joins the new socket room
        this.io.sockets.sockets.get(player.socketId).join(newGame.gameId);
        return newGame;
    }

    finishGame(gameId) {
        const game = this.rooms.get(gameId);
        if (!game) {
            return {
                status: false,
                message:"game not found"
            }
        }

        const status = this.rooms.delete(gameId)
        return {
            status,
            message:"game removed"
        }
    }

    getAllGameRooms() {
        const currentRooms = [...this.rooms.values()]
        const result = currentRooms.filter((game) => (game.state == GameState.LOBBY));
        return result;
    }

    getGameState(gameId) {
        if (this.rooms.has(gameId)) {
            return this.rooms.get(gameId)
        }
        return null;
    }

    removeGameState(gameId) {
        if (this.rooms.has(gameId)) {
            this.rooms.delete(gameId)
            return true
        }
        return false
    }
    
}