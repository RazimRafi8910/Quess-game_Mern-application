import { getQuestionsByCategory } from '../services/questions.service.js';
import { generateGameID } from '../utils/idGenerator.js';
import { GameState, PlayerRoles, QuestionState, QuestionType } from '../utils/constants.js'
import { generateAiQuestion } from '../services/geminAPI.service.js';
import { serializeQuestions } from '../utils/serializeQuestions.js';

export class Game {
    constructor(gameHost,category,gameName,password,playerLimit,hostSocketId,aiQuestion) {
        this.host = gameHost;
        this.gameName = gameName;
        this.category = category;
        this.playerLimit = playerLimit;
        this.players = new Map([
            [this.host.user_id, {
                username: this.host.username,
                role: PlayerRoles.HOST,
                isReady: false, // ready in game lobby
                status: true, //present in game or not
                completed:false,// is player completed the game or not
                socketId:hostSocketId,
            }]
        ]);
        this.questionType = aiQuestion ? QuestionType.AI : QuestionType.NORMAL;
        this.gameStartedTime = null;
        this.gameTime = 300;
        this.gameEndAt = null;
        this.questions = [];
        this.gameId = generateGameID();
        this.state = GameState.LOBBY;
        this.completedPlayerCount = 0;
        if (password == null || password == '') {
            this.secure = false
        } else {
            this.password = password;
            this.secure = true
        }
    }

    addPlayer(playerId, username, socketId, role = PlayerRoles.PLAYER) {
        if (this.players.size >= this.playerLimit) {
            return false
        }
        if (this.players.has(playerId)) {
           return true
        }
        const newPlayer = {
            username: username,
            isReady: false,
            status:true,
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
        this.questions = QuestionState.PENDING;
        this.generateQuestions().then((result) => {
            if (!result) {
                this.questions = false
            }
            this.questions = result;
        }).catch((e) => {
            this.questions = false
        })
        
        this.state = GameState.STARTED;
        
        return {
            message: "game started",
            status: true,
            game: this.toJson({ password: false, teams: true, questions:true }),
            gameStarted:false //does game move from lobbby or not
        }
    }

    //needs refacoring for all question related functions
    async generateQuestions() {
        const category = this.category;
        let result;
        
        if (this.questionType == QuestionType.AI) {
            result = await generateAiQuestion(this.category, 5);
            if (!result.status || result.error) {
                result = await getQuestionsByCategory(category);    
                return result;
            }
            console.log(result)
            const aiQuestions = serializeQuestions(result.questions)
            return aiQuestions;
        }
        result = await getQuestionsByCategory(category);
        if (result.error) {
            return null
        }
        return result.question
    }

    async getQuestion() {
        if (this.questions == QuestionState.PENDING) {
            console.log("return for pending")
            return {
                status: false,
                questionState: QuestionState.PENDING,
                error: false,
                messsage:"Question is generating"
            }
        }
        if (this.questions !== undefined || this.questions.length != 0) {
            return {
                status: true,
                error: false,
                message: "Question created",
            }
        }

        const result = await this.generateQuestions();

        if (!result || result.length == 0) {
            return {
                status: false,
                error: true,
                message:"Failed to generate question",
            }
        }
        this.question = result;

        return {
            status: true,
            error: false,
            message: "question created",
        }
    }

    startGameTimer() {
        if (this.gameEndAt !== null) {
            return {
                status: true,
                emit:false,
                startTime: this.gameStartedTime,
                endTime:this.gameEndAt,
                message:"timer started"
            }
        }
        const currentTime = Date.now();
        this.gameStartedTime = currentTime;
        this.gameEndAt = currentTime + this.gameTime * 1000;
        return {
            status: true,
            emit:true,
            startTime: this.gameStartedTime,
            endTime:this.gameEndAt,
            message:"timer started"
        }
    }

    removePlayer(playerId) {
        if (!this.players.has(playerId)) {
            return {
                status: false,
                host: false,
                message: 'player not found',
            }
        }
        const isHost = playerId === this.host.user_id;

        //for games in lobbys
        if (this.state == GameState.LOBBY) {
            this.players.delete(playerId)
            return {
                host: isHost,
                status:true
            }
        }

        const player = this.players.get(playerId);
        this.players.set(playerId, {
                ...player,
                status: false,
                isReady:false,
        });
        console.log("remove player "+ player.username)
        if (player.role === PlayerRoles.HOST) {
            const newHost = Array.from(this.players.entries()).find((item) => {
                return item[1].role == PlayerRoles.PLAYER ;
            })
            if (newHost) {
                this.host = {
                username: newHost[1].username,
                user_id:newHost[0]
                }
                //console.log(this.host)

                this.players.set(newHost[0], {
                    ...newHost[1],
                    role: PlayerRoles.HOST
                });
            }
        }

        return {
            host: isHost,
            status: true,
            newGameState: this.toJson(),
        }
    }

    //finish player state
    playerGameFinish({playerId,questionAnswer:playerAnswer}) {
        let player = this.players.get(playerId);
        if (!player) {
            return {
                status: false,
                message: "player not found",
                error: true,
                timeFail:false
            }
        }

        this.completedPlayerCount++ 
        if (this.completedPlayerCount === this.players.size) {
            console.log("game finshedd")
            this.state = GameState.FINISHED;
        }

        const currentTime = Date.now();
        // 2sec for system lag
        if (currentTime > this.gameEndAt) {
            console.log("[time fail, game submit] current time:%d  end time:%d", currentTime, this.gameEndAt);
            return {
                status: false,
                error: false,
                message: "Time fail, late submit",
                timeFail:true
            }

        }

        // calculate player score
        let playerResult = {
            score: 0,
            correct: 0,
            incorrect: 0,
        }
        
        let questionMap
        questionMap = new Map(this.questions.map((item) => ([item._id.toString(), item])));
        playerAnswer.map((answer) => {
            if (answer.playerState !== undefined) {
                const currentQuestion = questionMap.get(answer._id);
                if (currentQuestion.answer == answer.playerState.answeredOption) {
                    playerResult.score += 3;
                    playerResult.correct++
                    console.log(playerResult.score)
                } else {
                    playerResult.score -= 1;
                    playerResult.incorrect++;
                }
            }
        });

        playerResult.notAttent = this.questions.length - (playerResult.correct + playerResult.incorrect);

        this.players.set(playerId, {
            ...player,
            completed: true,
            gameResult: playerResult,
        });

        //TODO:check all players result are calculated then close the game

        return {
            status: true,
            errro: false,
            message:"Player result updated",
        }

    }

    isFinished() {
        return this.state === GameState.FINISHED
    }

    toJson({ password = false, teams = false, questions = false } = {}) {
        let response = {
            host: this.host,
            gameName: this.gameName,
            category: this.category,
            playerLimit: this.playerLimit,
            players: [...this.players],
            gameId: this.gameId,
            state: this.state,
            gameEndAt: this.gameEndAt,
            gameTime: this.gameTime,
            gameQuestionType:this.questionType,
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

        if (questions) {
            if (this.questions == QuestionState.PENDING) {
                response = {
                    ...response,
                    questions:'Pending'
                }    
            } else {
                const clientQuestion = this.questions.map((question) => { return { ...question, answer: null } });
                response = {
                    ...response,
                    questions:clientQuestion
                }
            }
        }
        return response
    }
}