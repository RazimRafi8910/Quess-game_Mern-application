
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
    SOCKET_ERROR = 'socket_error',
    GAME_ROOM_STARTING = 'room_starting',
    GAME_ROOM_CLOSED = 'room_closed'
}

export enum SocketEvents {
    CONNECTION = '',
    DISCONNECT = '',
    GAME_RUN = 'game_run',
    JOIN_ROOM = 'join_room',
    LEAVE_ROOM = 'leave_room',
    CLOSE_ROOM = 'close_room',
    START_GAME = 'start_game',
    PLAYER_UPDATE = 'player_update',
    SOCKET_ERROR = 'socket_error'
}

export type QuestionOptionType = {
    option: Options
    optionValue: string 
}

export type QuestionType = {
    question: string
    options: QuestionOptionType[]
    answer: Options
    listed?: boolean
    category: string
    _id:string
}

export type CategorysType = {
    categoryName: string
    totalQuestions: number
    _id:string
}

export type GameRoomPlayerType = {
    username: string,
    role: 'host' | 'player'
    isReady: boolean
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
    questions: []
    team1: GameTeamType
    team2:GameTeamType
    players:  Map<string,GameRoomPlayerType>
    playerLimit:number
}