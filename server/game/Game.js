import { generateGameID } from '../utils/idGenerator.js'


export class Game {
    constructor(host,category,gameName,password) {
        this.host = host;
        this.gameName = gameName;
        this.category = category;
        this.players = new Map(host.user_id, {...host,role: 'host'});
        this.gameId = generateGameID();
        this.state = 'Lobby';
        if (password !== '' || password !== null) {
            this.password = password
            this.secure = true
        } else {
            this.secure = false
        }
    }

    addPlayer(player,role) {
       if(this.players.has(player.user_id)) {
            return false; // player already exists
        } else if (this.players.size > 8) {
           return false; // max players reached
        } else {
            this.players.set(player.user_id, { ...player, role });
            return true; // player added successfully
        }
    }

    removePlayer(player) {
        if (this.players.has(player.user_id)) {
            this.players.delete(player.user_id);
            return true; // player removed successfully
        } else {
            return false; // player not found
        }
    }
}