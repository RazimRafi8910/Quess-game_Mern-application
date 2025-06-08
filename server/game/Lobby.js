import { Game } from "./Game.js";
import { ServerSocketEvents } from '../utils/constants.js'

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

    createGame(gameHost, category, gameName, password, noPlayers, userId) {
        //create a new game
        const newGame = new Game(gameHost, category, gameName, password, noPlayers);
        const player = this.players.get(userId); // add player to the lobby state
        this.rooms.set(newGame.gameId, newGame);
        this.io.emit(ServerSocketEvents.LOBBY_ROOM_UPDATE, {data: this.getAllGameRooms()});
        //player joins the new socket room
        this.io.sockets.sockets.get(player.socketId).join(newGame.gameId);
        return newGame;
    }

    getAllGameRooms() {
        const currentRooms = [...this.rooms.values()]
        return currentRooms
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