import { getQuestionsByCategory } from '../services/questions.js';
import { generateGameID } from '../utils/idGenerator.js';
import { GameState } from '../utils/constants.js'


export class Game {
    constructor(gameHost,category,gameName,password,playerLimit,hostSocketId) {
        this.host = gameHost;
        this.gameName = gameName;
        this.category = category;
        this.playerLimit = playerLimit;
        this.players = new Map([
            [this.host.user_id, {
                username: this.host.username,
                role: 'host',
                isReady: false,
                socketId:hostSocketId,
            }]
        ]);
        this.questions = [];
        this.gameId = generateGameID();
        this.state = GameState.LOBBY;
        if (password == null || password == '') {
            this.secure = false
        } else {
            this.password = password;
            this.secure = true
        }
        console.log(this.secure)
    }

    addPlayer(playerId, username, socketId, role = 'player') {
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
            socketId,
        }
        this.players.set(playerId, newPlayer)
        return true;
    }

    checkGamePassword(password) {
        if (this.password != password && this.secure) {
            return false
        }
        return true
    }

    //TODO: find logic for splting member and complete code
    makeTeam() {
        this.team1 = {
            teamId: generateGameID(),
            teamPlayers:[],
        }
        this.team2 = {
            teamId: generateGameID(),
            teamPlayers:[],
        }

        const players = [...this.players];
        if (this.playerLimit == 2) {
            this.team1.teamPlayers.push(players[0]);
            this.team2.teamPlayers.push(players[1]);

            return {
                status: true,
                teamOne: this.team1,
                teamTwo:this.team2,
            };
        }

        let currentTeam = 1;
        while (players.length > 0) {
            const player = players.pop(Math.random() * players.length);
            if (currentTeam == 1) {
                this.team1.teamPlayers.push(player);
                currentTeam = 2;
            } else {
                this.team2.teamPlayers.push(player);
                currentTeam = 1;
            }
        }
        
        return {
            status: true,
            teamOne: this.team1,
            teamTwo:this.team2,
        }
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
            return {
                message: "Player is not host",
                status:false
            };
        }

        if (this.players.size < 2) {
            return {
                message: "minimun 2 players is requied to start the game",
                status:false
            }
        }

        const notReadyPlayers = [...this.players].find((player) => !player[1].isReady && player[1].role !== 'host') || null;
        if (notReadyPlayers) {
            return {
                message: "Players are not ready",
                status:false
            }
        }

        const host = this.players.get(hostId);
        host.isReady = true;

        //team creation
        const teamGenerationStat = this.makeTeam();
        if (!teamGenerationStat.status) {
            return {
                message: "Team not generated",
                status:false,
            }
        }

        //question generation
        this.generateQuestions().then((result) => {
            this.questions.push(result);
        })
        this.state = GameState.STARTED;
        
        return {
            message: "game started",
            status: true,
            gameId: this.gameId,
            team1: this.team1,
            team2:this.team2,
            gameStarted:false //does game move from lobbby or not
        }
    }

    async generateQuestions() {
        const category = this.category;
        const result = await getQuestionsByCategory(category);
        if (result.error) {
            return null
        }
        return result.question
    }

    removePlayer(playerId) {
        if (this.players.has(playerId)) {

            if (playerId == this.host.user_id) {
                return {
                    status: false,
                    host:true
                }
            }

            this.players.delete(playerId);
            return {
                status: true,
                host:false,
            } // player removed successfully
        }
        return {
            status: false,
            host:false
        }; // player not found
        
    }

    toJson({ password = false, teams = false } = {}) {
        let response = {
            host: this.host,
            gameName: this.gameName,
            category: this.category,
            playerLimit: this.playerLimit,
            players: [...this.players],
            gameId: this.gameId,
            state: this.state,
        }
        if (password) {
            response = {
                ...response,
                secure: this.secure,
                password: this.password
            }
        }

        if (teams) {
            response = {
                ...response,
                teamOne: this.team1,
                teamTwo:this.team2,
            }
                
        }
        return response
    }
}