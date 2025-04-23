
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
    SOCKET_ERROR = 'socket_error'
}

export enum SocketEvents {
    CONNECTION = '',
    DISCONNECT = '',
    JOIN_ROOM = 'join_room',
    LEAVE_ROOM = 'leave_room',
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
    isReady:boolean
}


export type GameRoomType = {
    category: string
    host: {
        username: string,
        user_id:string
    }
    gameId: string
    state: string
    players:  [string,GameRoomPlayerType][]
    gameName: string
    playerLimit:number
}