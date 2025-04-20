
enum Options {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D'
}

export enum ServerSocketEvnets {
    LOBBY_PLAYER_UPDATE = 'current_players',
    LOBBY_ROOM_UPDATE = 'current_rooms'
}

export enum SocketEvents {
    CONNECTION = '',
    DISCONNECT = '',
    JOIN_ROOM = 'join_room'
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


export type GameRoomType = {
    category: string
    host: string
    gameId: string
    state: string
    players: string[]
    gameName:string
}