import { generateGameID } from '../utils/idGenerator.js'


export class Game {
    constructor(gameHost,category,gameName,password,playerLimit) {
        this.host = gameHost;
        this.gameName = gameName;
        this.category = category;
        this.playerLimit = playerLimit;
        this.players = new Map([
            [this.host.user_id, {
                username: this.host.username,
                role: 'host',
                isReady:false
            }]
        ]);
        this.gameId = generateGameID();
        this.state = 'Lobby';
        if (password !== '' || password !== null) {
            this.password = password
            this.secure = true
        } else {
            this.secure = false
        }
    }

    addPlayer(playerId,username, role = 'player') {
        if (this.players.size >= this.playerLimit) {
            return false
        }
        if (this.players.has(playerId)) {
           return true
        }
        const newPlayer = {
            username: username,
            isReady: false,
            role,
        }
        this.players.set(playerId,newPlayer)
        return true;
    }

    removePlayer(playerId) {
        if (this.players.has(playerId)) {
            this.players.delete(playerId);
            return true; // player removed successfully
        } else {
            return false; // player not found
        }
    }

    toJson() {
        return {
            host: this.host,
            gameName: this.gameName,
            category: this.category,
            playerLimit: this.playerLimit,
            players: [...this.players],
            gameId: this.gameId,
            state: this.state,
            secure: this.secure,
            password: this.password
        }
    }
}