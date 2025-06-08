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
        console.log(password)
        if (password !== '' || password !== null) {
            this.password = password
            this.secure = true
        } else {
            this.secure = false
        }
    }

    addPlayer(playerId, username, role = 'player') {
        console.log("limit " + this.playerLimit)
        console.log("player " + this.players.size)
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
        this.players.set(playerId, newPlayer)
        return true;
    }

    updatePlayerIsready(playerId,status) {
        const player = this.players.get(playerId)
        if (!player) {
            return false;
        }

        player.isReady = status
        return true
    }

    startGame(hostId) {
        if (hostId != this.host.user_id) {
            return false;
        }
        
        const notReadyPlayers = [...this.players].find((player) => !player[1].isReady && player[1].role !== 'host') || null;
        if (notReadyPlayers) {
            return false
        }
        const host = this.players.get(hostId);
        host.isReady = true;
        this.state = 'Started'
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