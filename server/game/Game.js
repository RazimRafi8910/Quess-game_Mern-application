import { generateGameID } from '../utils/idGenerator.js'


export class Game {
    constructor(host,category,gameName) {
        this.host = host;
        this.gameName = gameName;
        this.category = category;
        this.players = [host];
        this.gameId = generateGameID();
        this.state = 'Lobby';
    }

    addPlayer(player) {
        if (player) {
            this.players.push(player);
        }
    }

    removePlayer(player) {
        this.players.pop(player);
    }
}