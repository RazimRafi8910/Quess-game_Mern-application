import { Game } from "./Game.js";

export class Lobby {
    constructor(io) {
        this.io = io;
        this.rooms = new Map();
        this.roomsCount = 0;
        this.players = 0;
    }

    addPlayer() {
        this.players++;
    }

    removePlayer() {
        this.players--;
    }

    createGame(hostname,category,gameName) {
        const newGame = new Game(hostname, category,gameName)
        this.rooms.set(newGame.gameId, newGame);
        this.io.emit('game-created', this.getAllGameRooms());
        return newGame;
    }

    getAllGameRooms() {
        const currentRooms = [...this.rooms.values()]
        return currentRooms
    }
}