
enum Options {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D'
}

export enum ServerSocketEvnets {
    LOBBY_PLAYER_UPDATE = 'current_players',
    LOBBY_ROOM_UPDATE = 'current_rooms',
    GAME_ROOM_UPDATE = 'room_update',
    GAME_ROOM_ERROR = 'game_error',
    GAME_ROOM_QUESTION = 'game_question_update',
    SOCKET_ERROR = 'socket_error',
    GAME_ROOM_STARTING = 'room_starting',
    GAME_ROOM_CLOSED = 'room_closed',
    GAME_ROOM_TIME_END = 'time_end',
    GAME_ROOM_TIME_UPDATE = 'time_update' //to start the timer, server send game end time
}

export enum SocketEvents {
    GAME_RUN = 'game_run',
    GAME_QUESTION = 'game_question',
    JOIN_ROOM = 'join_room', 
    LEAVE_ROOM = 'leave_room',
    CLOSE_ROOM = 'close_room', //for clossing the room by host
    START_GAME = 'start_game',
    QUIT_GAME = 'quit_game', // for host and player in game running state
    PLAYER_UPDATE = 'player_update',
    GAME_STATE = 'game_state',
    SOCKET_ERROR = 'socket_error'
}

export enum GameStateType {
    FINISHED = 'finished',
    RUNNING = 'running',
    LOBBY = 'lobby',
}

export enum QuestionStatus {
    CURRENT = "CURRENT",
    NOTANSWERED = "NOTANSWERED",
    ANSWERED = "ANSWERED"
}

export type QuestionOptionType = {
    option: Options
    optionValue: string 
}

export type QuestionType = {
    _id:string
    question: string
    options: QuestionOptionType[]
    answer?: Options
    listed?: boolean
    category: string
    playerState?: {
        questionStatus: QuestionStatus,
        answeredOption: Options | null,
    }
}

export type PlayerAnswer = {
    questionNo: number
    questionId: string
    answeredOption: string
    questionStatus: QuestionStatus
}

export type CategorysType = {
    categoryName: string
    totalQuestions: number
    _id:string
}

export type GameRoomPlayerType = {
    playerId?:string
    username: string
    role: 'host' | 'player'
    isReady: boolean
    status:boolean // player online status
    socketId:string
}

type GameTeamType = {
    teamId: string
    teamPlayers:GameRoomPlayerType[]
}

export type GameRoomType = {
    category: string
    gameName: string
    host: {
        username: string,
        user_id:string
    }
    secure:boolean
    gameId: string
    state: string
    questions: QuestionType[] | []
    team1: GameTeamType
    team2:GameTeamType
    players:  Map<string,GameRoomPlayerType>
    playerLimit:number
}