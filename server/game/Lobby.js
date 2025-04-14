import { Game } from "./Game.js";

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

    createGame(hostname,category,gameName,userId) {
        const newGame = new Game(hostname, category, gameName)
        const player = this.players.get(userId);
        this.rooms.set(newGame.gameId, newGame);
        this.io.emit('game-created', this.getAllGameRooms());
        //player joins the new socket room
        this.io.sockets.sockets.get(player.socketId).join(newGame.gameId);
        return newGame;
    }

    getAllGameRooms() {
        const currentRooms = [...this.rooms.values()]
        return currentRooms
    }
}